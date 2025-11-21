import { useContext } from "react";
import { Table, type TActionEvent } from "./component/table.component";
import { TableContext } from "./context/table.context";
import { TABLE_CONTEXT_KEYS } from "./constant/context.const";

const columns = [
  { label: "Label", id: "label" },
  { label: "Value", id: "value" },
  { label: "Input", id: "input" },
  { label: "Allocation %", id: "allocation_percent" },
  { label: "Allocation val", id: "allocation_val" },
  { label: "Variance %", id: "variance_percent" },
];

function App() {
  const { value, dispatch } = useContext(TableContext);

  const onRowInput = (events: TActionEvent) => {
    console.log("Row Input Event: ", events);
  };

  const onRowAllocationPercent = (events: TActionEvent) => {
    dispatch({
      type: TABLE_CONTEXT_KEYS.UPDATE_ALLOCATION_PERCENT,
      payload: events,
    });
  };

  const onRowAllocationVal = (events: TActionEvent) => {
    dispatch({
      type: TABLE_CONTEXT_KEYS.UPDATE_ALLOCATION_VALUE,
      payload: events,
    });
  };
  return (
    <Table
      columns={columns}
      rows={value.rows}
      onRowAllocationPercent={onRowAllocationPercent}
      onRowInput={onRowInput}
      onRowAllocationVal={onRowAllocationVal}
    />
  );
}

export default App;
