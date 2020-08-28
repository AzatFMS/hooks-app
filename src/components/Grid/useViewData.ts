import React, {useEffect, useState} from "react";
import {SortDirection} from "./useGridSort";
import {ColumnId, GridFilter, GridItemData} from "./Grid";

const useViewData = <TItem extends GridItemData>({
  data,
  filter,
  filterText,
  sortDirection,
  sortColumnId,
}: {
  data: TItem[];
  filter: GridFilter<TItem>;
  filterText: string | undefined;
  sortDirection: SortDirection;
  sortColumnId: ColumnId | null;
}): {
  viewData: TItem[];
} => {
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

  return {
    viewData,
  };
}

export default useViewData;
