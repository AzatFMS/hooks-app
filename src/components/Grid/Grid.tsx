import React, {CSSProperties, ReactElement, useMemo} from 'react';
import useGridFilter from "./useGridFilter";
import useGridSort from "./useGridSort";
import useViewData from "./useViewData";

export interface GridItemData {
  [key: string]: string | number;
}

export type ColumnId = string;

export type GridFilter<TItem> = (item: TItem, filterText: string) => boolean;

export interface GridColumn {
  id: ColumnId;
  title: string;
}

interface GridProps<TItem extends GridItemData> {
  columns: GridColumn[];
  data: TItem[];
  filter: GridFilter<TItem>;
}

const Grid = <TItem extends GridItemData>({
    columns,
    data,
    filter,
  }: GridProps<TItem>): ReactElement => {

  const {
    filterText,
    handlerInputFilterText,
  } = useGridFilter();

  const {
    setSort,
    sortColumnId,
    sortDirection,
  } = useGridSort();

  const {
    viewData,
  } = useViewData<TItem>({
    data,
    filter,
    filterText,
    sortDirection,
    sortColumnId,
  });

  const columnStyle = useMemo<CSSProperties>(() => ({
    width: `${100/columns.length}%`,
  }), [columns]);

  return (
    <>
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Поиск"
          value={filterText}
          onChange={handlerInputFilterText}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            {
              columns.map(({id, title}) => (
                <th
                  key={id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSort(id);
                  }}
                  style={columnStyle}
                >
                  {title}
                  {
                    sortColumnId === id &&
                    <span className="text-primary">
                      {
                        sortDirection
                          ? ' ↑'
                          : ' ↓'
                      }
                    </span>
                  }
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            viewData.map(item => (
              <tr>
                {
                  columns.map(({id: columnId}) => (
                    <td
                      key={columnId}
                    >
                      {item[columnId]}
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default Grid;
