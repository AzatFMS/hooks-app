import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';

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

interface GridState {
  sortColumnId: ColumnId | null;
  sortDirection: SortDirection;
  viewData: GridItemData[];
  filterText?: string;
}

class Grid<TItem extends GridItemData> extends Component<GridProps<TItem>, GridState> {

  state: GridState = {
    sortColumnId: null,
    sortDirection: SortDirection.ASC,
    viewData: [],
  }

  render() {

    const {
      columns,
    } = this.props;

    const {
      sortColumnId,
      sortDirection,
      viewData,
      filterText,
    } = this.state;

    return (
      <>
        <div className="input-group my-3">
          <input
            type="text"
            className="form-control"
            placeholder="Поиск"
            value={filterText}
            onChange={this.handlerInputFilterText}
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
                      this.setOrder(id);
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

  componentDidMount() {
    this.generateViewData();
  }

  componentDidUpdate(prevProps: Readonly<GridProps<TItem>>) {
    if (prevProps.data !== this.props.data) {
      this.generateViewData();
    }
  }

  private handlerInputFilterText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      filterText: e.target.value
    }, this.generateViewData);
  }

  private setOrder = (sortColumnId: ColumnId | null): void => {

    this.setState({
      sortColumnId,
      sortDirection: this.getSortDirectionByNewSortColumnId(sortColumnId),
    }, this.generateViewData)
  }

  private getSortDirectionByNewSortColumnId = (sortColumnId: ColumnId | null): SortDirection => {
    const {
      sortColumnId: prevSortColumnId,
      sortDirection: prevSortDirection,
    } = this.state;

    if (sortColumnId === prevSortColumnId) {
      return prevSortDirection === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC;
    }

    return  SortDirection.ASC;
  }

  private generateViewData = (): void => {
    const {
      data,
      filter,
    } = this.props;

    const {
      sortColumnId,
      sortDirection,
      filterText,
    } = this.state;

    const viewData = data
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
      });

    this.setState({
      viewData,
    })
  }
}

export default Grid;
