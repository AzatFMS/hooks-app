import React, {useCallback, useState} from "react";
import {ColumnId} from "./Grid";

export enum SortDirection {
  ASC,
  DESC,
}

type SetSort = (newSortColumnId: ColumnId | null) => void;

const useGridSort = (): {
  setSort: SetSort;
  sortColumnId: ColumnId | null;
  sortDirection: SortDirection;
} => {
  const [sortColumnId, setSortColumnId] = useState<ColumnId | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);

  const setSort = useCallback((newSortColumnId: ColumnId | null): void => {
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

  return {
    setSort,
    sortColumnId,
    sortDirection,
  };
}

export default useGridSort;
