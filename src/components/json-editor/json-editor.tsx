import React, { useRef, useState } from "react";

import { Stack, IStackStyles } from "@fluentui/react";
import Editor, { OnMount, OnValidate } from "@monaco-editor/react";

import { useToggle } from "../../hooks";
import { CommandBar } from "../command-bar";
import { ErrorMessageBar } from "../error-message-bar";
import { downloadJsonFile } from "./file";
import { prettifyJsonString, minifyJsonString } from "./utils";

const stackStyles: IStackStyles = {
  root: {
    height: "100%",
  },
};

interface JSONEditorProps {
  defaultValue?: string;
  onSchemaEditorChange?: () => void;
  isSchemaEditorOn?: boolean;
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  isSchemaEditorOn = false,
  defaultValue,
  onSchemaEditorChange,
}): JSX.Element => {
  const [errors, setErrors] = useState<string[]>([]);
  const [content, setContent] = useState<string | undefined>(undefined);
  const [isAutoPrettifyOn, toggleAutoPrettifyOn] = useToggle(false);
  const [isValidJson, setIsValidJson] = useState<boolean>(false);
  const editorRef = useRef(null);

  const handleEditorWithoutPrettify = (value?: string) => setContent(value);

  const handleEditorPrettify = (value?: string) => {
    if (!value) {
      setContent(undefined);
    } else {
      const json = prettifyJsonString(value);
      setContent(json);
      // eslint-disable-next-line
      const editor: any = editorRef.current;
      // It might be a  @monaco-editor/react's problem.
      // need to set new value inside. otherwise, it can't resize horizontal slider's  width.
      if (!editor) return;
      editor.setValue(json);
    }
  };

  const handleEditorBeforeMount = () => handleEditorPrettify(defaultValue);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.getModel().updateOptions({ tabSize: 2, insertSpaces: false });
  };

  const handleEditorChange = (value?: string) =>
    isAutoPrettifyOn
      ? handleEditorPrettify(value)
      : handleEditorWithoutPrettify(value);

  const handleClearClick = () => setContent(undefined);

  const handleEditorValidation: OnValidate = (markers) => {
    const errorMessage = markers.map(
      ({ startLineNumber, message }) => `line ${startLineNumber}: ${message}`
    );
    const hasContent: boolean = !!content && content?.length > 0;
    const hasError: boolean = errorMessage.length > 0;
    setIsValidJson(hasContent && !hasError);
    setErrors(errorMessage);
  };

  const handleMinifyClick = () => {
    const minifyJson: string | undefined = content
      ? minifyJsonString(content)
      : content;
    handleEditorWithoutPrettify(minifyJson);
  };

  const handlePrettifyClick = () => handleEditorPrettify(content);

  const handleUploadClick = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const result = fileReader.result as string;
      handleEditorPrettify(result);
    };
    fileReader.readAsText(file);
  };

  const handleDownloadClick = () =>
    content && isValidJson && downloadJsonFile(content);

  return (
    <Stack styles={stackStyles}>
      <Stack.Item>
        <CommandBar
          isValidJson={isValidJson}
          isAutoPrettifyOn={isAutoPrettifyOn}
          isSchemaEditorOn={isSchemaEditorOn}
          onAutoPrettifyChange={toggleAutoPrettifyOn}
          onClearClick={handleClearClick}
          onDownloadClick={handleDownloadClick}
          onSchemaEditorChange={onSchemaEditorChange}
          onMinifyClick={handleMinifyClick}
          onPrettifyClick={handlePrettifyClick}
          onUploadClick={handleUploadClick}
        />
      </Stack.Item>
      <Stack styles={stackStyles}>
        <Stack.Item grow align="stretch">
          <Editor
            defaultLanguage="json"
            options={{
              // formatOnPaste: true is working but the width replied on unformatted string's width
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
            beforeMount={handleEditorBeforeMount}
            defaultValue={defaultValue}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            onValidate={handleEditorValidation}
            value={content}
          />
        </Stack.Item>
        <Stack.Item>
          <ErrorMessageBar errors={errors} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
};