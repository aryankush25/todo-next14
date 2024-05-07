"use client";

import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { uniqBy } from "lodash";

interface Todo {
  id: string;
  todo: string;
  createdAt: string;
  createdBy: string;
  isCompleted: boolean;
}

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  console.log(todos);

  const getAllTodos = async () => {
    const querySnapshot = await getDocs(collection(db, "todos"));

    querySnapshot.forEach((doc) => {
      setTodos((prev) =>
        uniqBy([...prev, { id: doc.id, ...doc.data() } as Todo], "id")
      );
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(false);
        getAllTodos();
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const handleCreateNote = async () => {
    try {
      setIsCreating(true);
      const docRef = await addDoc(collection(db, "todos"), {
        todo,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid,
        isCompleted: false,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Todo App</h1>

      <button
        type="button"
        onClick={async () => {
          await auth.signOut();
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      <div className="gap-2 flex justify-center items-center">
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          type="text"
          placeholder="Enter TODO"
          className="border border-gray-300 rounded-md px-2 py-1 bg-black"
        />

        <button
          type="button"
          onClick={handleCreateNote}
          disabled={isCreating}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
        >
          {isCreating ? "Creating..." : "Create"}
        </button>
      </div>
    </main>
  );
}
