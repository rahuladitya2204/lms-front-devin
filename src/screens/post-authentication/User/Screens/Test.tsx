import { useQuery } from "@tanstack/react-query";

import React from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

type Todos = Array<Todo>;

const Test = () => {
  const { data, isLoading, isError } = useQuery<Todos>({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
        res.json()
      ),
  });
  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          {data?.map((todo) => (
            <p>{todo.title}</p>
          ))}
        </>
      )}
    </div>
  );
};

export default Test;
