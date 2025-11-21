import { useState } from "react";

type TColumn = {
  label: string;
  id: string;
};

export type TRow = {
  id: string;
  label: string;
  value: number;
  variance_percent?: number;
  children?: TRow[];
};
export type TActionEvent = {
  rowId: string;
  childId: string;
  parentId: string;
  value: number;
};

export type TTableActions = {
  onRowInput?: (events: TActionEvent) => void;
  onRowAllocationPercent?: (events: TActionEvent) => void;
  onRowAllocationVal?: (events: TActionEvent) => void;
};

export type TTableProps = {
  columns: TColumn[];
  rows: TRow[];
} & TTableActions;
const rowClasses = "p-2 border";

type TTableRowProps = {
  className?: string;
  row: TRow;
  isChild: boolean;
  parentId: string;
} & TTableActions;

const regex = /^\d*$/;

export const TableRow = (props: TTableRowProps) => {
  const {
    row,
    className = "",
    onRowInput,
    parentId,
    isChild,
    onRowAllocationPercent,
    onRowAllocationVal,
  } = props;
  const item: TActionEvent = {
    rowId: isChild ? parentId || "" : row.id,
    childId: isChild ? row.id : "",
    parentId: parentId,
    value: 0,
  };
  const [value, setValue] = useState<string>("");

  const handleChange = (value: string) => {
    if (regex.test(value)) {
      setValue(value);
    }
    if (onRowInput) {
      item.value = Number(value);
      onRowInput(item);
    }
  };

  const handleAllocationPercentChange = () => {
    if (value === "") {
      alert("Please enter a valid number");
      return;
    }

    const item: TActionEvent = {
      rowId: isChild ? parentId || "" : row.id,
      childId: isChild ? row.id : "",
      parentId: parentId,
      value: Number(value),
    };

    if (onRowAllocationPercent) {
      onRowAllocationPercent(item);
      setValue("");
    }
  };

  const handleAllocationValue = () => {
    if (value === "") {
      alert("Please enter a valid number");
      return;
    }

    const item: TActionEvent = {
      rowId: isChild ? parentId || "" : row.id,
      childId: isChild ? row.id : "",
      parentId: parentId,
      value: Number(value),
    };

    if (onRowAllocationVal) {
      onRowAllocationVal(item);
      setValue("");
    }
  };

  return (
    <tr className={className}>
      <td className={rowClasses}>{row.label}</td>
      <td className={rowClasses}>{row.value}</td>
      <td>
        <input
          className={rowClasses}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </td>
      <td className={rowClasses}>
        <button
          className="p-2 rounded-xl border"
          onClick={handleAllocationPercentChange}
        >
          update
        </button>
      </td>
      <td className={rowClasses}>
        <button
          className="p-2 rounded-xl border"
          onClick={handleAllocationValue}
        >
          update
        </button>
      </td>
      <td className={rowClasses}>
        {row.variance_percent ? row.variance_percent.toFixed(2) : "-"} %
      </td>
    </tr>
  );
};

export const Table = (props: TTableProps) => {
  const {
    columns = [],
    rows = [],
    onRowInput,
    onRowAllocationPercent,
    onRowAllocationVal,
  } = props;

  return (
    <table className="border">
      <thead>
        <tr className="p-2">
          {columns.map((column) => (
            <th className={rowClasses} key={column.id}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          return (
            <>
              <TableRow
                onRowInput={onRowInput}
                onRowAllocationPercent={onRowAllocationPercent}
                onRowAllocationVal={onRowAllocationVal}
                isChild={false}
                key={row.id}
                parentId={row.id}
                row={row}
              />
              {row.children &&
                row.children.map((child) => (
                  <TableRow
                    className="bg-sky-200"
                    isChild={true}
                    parentId={row.id}
                    row={child}
                    onRowInput={onRowInput}
                    onRowAllocationPercent={onRowAllocationPercent}
                    onRowAllocationVal={onRowAllocationVal}
                    key={child.id}
                  />
                ))}
            </>
          );
        })}
      </tbody>
    </table>
  );
};
