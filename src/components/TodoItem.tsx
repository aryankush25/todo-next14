"use client";

import { db } from "@/services/firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { debounce } from "lodash";
import { useState } from "react";

const TodoItem = ({
  todo,
  filterTodo,
  updateTodo,
}: {
  todo: any;
  filterTodo: Function;
  updateTodo: Function;
}) => {
  const [t, setT] = useState(todo.todo);
  const handleUpdateTodo = async (
    id: string,
    todo: {
      isCompleted?: boolean;
      todo?: string;
    }
  ) => {
    await updateDoc(doc(db, "todos", id), {
      ...todo,
    });

    updateTodo(id, todo);
  };

  const debouncedHandleUpdateTodo = debounce(handleUpdateTodo, 1000);

  return (
    <div key={todo.id} className="flex items-center gap-2">
      <input
        placeholder="Mark as completed"
        type="checkbox"
        checked={todo.isCompleted}
        onChange={async (e) => {
          handleUpdateTodo(todo.id, {
            isCompleted: e.target.checked,
          });
        }}
      />

      <input
        type="text"
        className="border border-gray-300 rounded-md px-2 py-1 bg-black"
        value={t}
        placeholder={todo.todo}
        onChange={async (e) => {
          setT(e.target.value);

          debouncedHandleUpdateTodo(todo.id, {
            todo: e.target.value,
          });
        }}
      />

      <button
        type="button"
        onClick={async () => {
          await deleteDoc(doc(db, "todos", todo.id));
          filterTodo(todo.id);
        }}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
