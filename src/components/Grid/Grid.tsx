import React, {ReactElement, useCallback, useEffect, useState} from 'react';

export interface GridItemData {
  [key: string]: string | number;
}

type ColumnId = string;

enum SortDirection {
  ASC,
  DESC,
}

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

function Grid<TItem extends GridItemData> ({
  columns,
  data,
  filter,
 }: GridProps<TItem>): ReactElement {

  const [filterText, setFilterText] = useState<string>();
  const handlerInputFilterText = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilterText(e.target.value);
  }, []);

  const [sortColumnId, setSortColumnId] = useState<ColumnId | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);

  const setOrder = useCallback((newSortColumnId: ColumnId | null): void => {
    const getSortDirection = (): SortDirection => {
      if (sortColumnId === newSortColumnId) {
        return sortDirection === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC;
      }

      return  SortDirection.ASC;
    }
    setSortDirection(getSortDirection());
    setSortColumnId(newSortColumnId);
  }, [sortColumnId, sortDirection]);

  const [viewData, setViewData] = useState<TItem[]>([]);

  useEffect(() => {
    setViewData(data
      .filter(item => {
        if (!filterText) {
          return true;
        }
        return filter(item, filterText);
      })
      .sort((a, b) => {
        if (sortColumnId === null || a[sortColumnId] === b[sortColumnId]) {
          return 0;
        }
        if (sortDirection === SortDirection.ASC) {
          return a[sortColumnId] > b[sortColumnId] ? 1 : -1;
        }
        return a[sortColumnId] > b[sortColumnId] ? -1 : 1;
      })
    );
  }, [
    data,
    filter,
    filterText,
    sortDirection,
    sortColumnId,
  ]);

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
            columns.map(({ id, title }) => (
              <th
                key={id}
                className="cursor-pointer"
                onClick={() => {
                  setOrder(id);
                }}
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
                columns.map(({ id: columnId }) => (
                  <td
                    key={columnId}
                  >
                    { item[columnId] }
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
