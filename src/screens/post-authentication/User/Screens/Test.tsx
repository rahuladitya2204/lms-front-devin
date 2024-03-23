import { useQuery } from "@tanstack/react-query";

import React from "react";

const Test = () => {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: "todos",
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
        res.json()
      ),
  });
  return <div>{isLoading ? "Loading..." : data}</div>;
};

export default Test;
