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
    <div key={todo.id} className="flex items-center gap-4">
      <input
        placeholder="Mark as completed"
        className="form-checkbox text-blue-600 h-6 w-6 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        type="checkbox"
        checked={todo.isCompleted}
        onChange={async (e) => {
          handleUpdateTodo(todo.id, {
            isCompleted: e.target.checked,
          });
        }}
      />

      {todo.isCompleted ? (
        <p className="line-through text-gray-400 flex-1">{t}</p>
      ) : (
        <input
          type="text"
          className="bg-black text-white flex-1"
          value={t}
          placeholder={todo.todo}
          onChange={async (e) => {
            setT(e.target.value);

            debouncedHandleUpdateTodo(todo.id, {
              todo: e.target.value,
            });
          }}
        />
      )}

      <button
        type="button"
        onClick={async () => {
          await deleteDoc(doc(db, "todos", todo.id));
          filterTodo(todo.id);
        }}
        className="border-red-500 border hover:bg-red-700 text-white text-sm py-1 px-4 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
