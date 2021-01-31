import React from "react";

import {
  DetailsList,
  ScrollablePane,
  ScrollbarVisibility,
  Sticky,
  StickyPositionType,
  mergeStyleSets,
  IDetailsHeaderProps,
  IRenderFunction,
  IColumn,
} from "@fluentui/react";
import { v4 as uuid } from "uuid";

interface ErrorMessageBarProps {
  errors: string[];
}

const classNames = mergeStyleSets({
  wrapper: {
    height: "20vh",
    position: "relative",
    maxHeight: "inherit",
  },
});

const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
  props,
  defaultRender
) => {
  if (!props) return null;
  return (
    <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
      {defaultRender!({
        ...props,
      })}
    </Sticky>
  );
};

export const ErrorMessageBar: React.FC<ErrorMessageBarProps> = ({
  errors,
}): JSX.Element => {
  const items = errors.map((error) => ({
    key: `error-${uuid()}`,
    problems: error,
  }));

  const columns: IColumn[] = [
    {
      key: "problems",
      name: "Problems",
      fieldName: "problems",
      minWidth: 300,
      maxWidth: 300,
      isResizable: true,
    },
  ];

  return (
    <div className={classNames.wrapper}>
      <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
        <DetailsList
          compact
          items={items}
          columns={columns}
          checkboxVisibility={2}
          onRenderDetailsHeader={onRenderDetailsHeader}
        />
      </ScrollablePane>
    </div>
  );
};
