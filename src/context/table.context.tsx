import React, { createContext, useReducer } from "react";
import type { TActionEvent, TRow } from "../component/table.component";
import { hierarchical } from "../constant/table_json";
import { TABLE_CONTEXT_KEYS } from "../constant/context.const";
import type { TContextActionKeys } from "../types/table.types";

type TAction = { type: TContextActionKeys; payload: TActionEvent };

type TTableState = {
  rows: TRow[];
};

type TTableContext = {
  value: TTableState;
  dispatch: React.Dispatch<TAction>;
};

const initialValue: TTableState = {
  rows: JSON.parse(JSON.stringify(hierarchical.rows)),
};

// rowId: string;
//   childId: string;
//   parentId: string;
//   value: number;

const getPercentageValue = (total: number, percent: number) => {
  return (total * percent) / 100;
};

const getCurrentPercentage = (total: number, current: number) => {
  const result = (current / total) * 100;
  return result;
};

const getChildVariancePercent = (total: number, current: number) => {
  return ((total - current) / current) * 100;
};

const updateAllocationValue = (state: TTableState, action: TAction) => {
  const { rowId, childId, value } = action.payload;

  let newTotalVariance = 0;
  let newChildVariance = 0;
  let childTotal = 0;
  const isParent = childId === "";
  const updatedRows = state.rows.map((row) => {
    if (row.id === rowId && !isParent) {
      row.children = row.children?.map((child) => {
        if (child.id === childId) {
          newChildVariance = getChildVariancePercent(value, child.value);
          child.variance_percent = newChildVariance;
          child.value = value;
        }
        childTotal += child.value;
        return child;
      });
      newTotalVariance = getChildVariancePercent(childTotal, row.value);
      row.variance_percent = newTotalVariance;
      row.value = childTotal;
    }

    if (row.id === rowId && isParent) {
      row.children = row.children?.map((child) => {
        console.log("Child before update: ", child, row.value, value);
        const childPercent = getCurrentPercentage(row.value, child.value);

        const updatedChildValue = getPercentageValue(value, childPercent);
        newChildVariance = getChildVariancePercent(
          updatedChildValue,
          child.value
        );
        child.variance_percent = newChildVariance;
        child.value = updatedChildValue;
        row.variance_percent = getChildVariancePercent(value, row.value);
        return child;
      });
      row.value = value;
    }

    return row;
  });
  return updatedRows;
};

const updateAllocationPercent = (state: TTableState, action: TAction) => {
  const { rowId, childId, value } = action.payload;
  const isParent = childId === "";
  let newTotalVariance = 0;
  let childTotal = 0;
  const updatedRows = state.rows.map((row) => {
    if (row.id === rowId && !isParent) {
      row.children = row.children?.map((child) => {
        if (child.id === childId) {
          const newValue = getPercentageValue(value, child.value);
          child.variance_percent = value;
          child.value += newValue;
        }
        childTotal += child.value;
        return child;
      });
      newTotalVariance = ((childTotal - row.value) / row.value) * 100;
      row.variance_percent = newTotalVariance;
      row.value = childTotal;
    }

    if (row.id === rowId && isParent) {
      const newValue = getPercentageValue(row.value, value);

      row.variance_percent = value;
      row.children = row.children?.map((child) => {
        const childPercent = getCurrentPercentage(row.value, child.value);
        const updatedChildValue = getPercentageValue(newValue, childPercent);
        child.variance_percent = getChildVariancePercent(
          child.value + updatedChildValue,
          child.value
        );
        child.value += updatedChildValue;
        return child;
      });
      row.value += newValue;
    }

    return row;
  });
  return updatedRows;
};

const reducer = (state: TTableState, action: TAction) => {
  console.log("Reducer Action: ", action);

  switch (action.type) {
    case TABLE_CONTEXT_KEYS.UPDATE_ALLOCATION_VALUE:
      //logic to update allocation percent

      const updatedRows = updateAllocationValue(state, action);
      return { ...state, rows: updatedRows };
    case TABLE_CONTEXT_KEYS.UPDATE_ALLOCATION_PERCENT:
      const updatedPercentRows = updateAllocationPercent(state, action);
      return { ...state, rows: updatedPercentRows };
    default:
      return { ...state };
  }
};

export const TableContext = createContext({} as TTableContext);

const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, dispatch] = useReducer(reducer, initialValue);
  return (
    <TableContext.Provider value={{ value, dispatch }}>
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider;
