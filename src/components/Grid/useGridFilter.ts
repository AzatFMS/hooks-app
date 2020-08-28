import React, {useCallback, useState} from "react";

type HandlerInputFilterText = (e: React.ChangeEvent<HTMLInputElement>) => void;

const useGridFilter = (): {
  filterText: string | undefined;
  handlerInputFilterText: HandlerInputFilterText;
} => {
  const [filterText, setFilterText] = useState<string>();
  const handlerInputFilterText = useCallback<HandlerInputFilterText>((e) => {
    setFilterText(e.target.value);
  }, []);
  return {
    filterText,
    handlerInputFilterText,
  }
}

export default useGridFilter;
