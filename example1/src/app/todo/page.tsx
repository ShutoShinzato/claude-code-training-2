'use client';

import { useState, useEffect } from 'react';
import styles from './todo.module.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // LocalStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse todos:', e);
      }
    }
  }, []);

  // LocalStorageに保存
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className={styles.container}>
      <div className={styles.todoBox}>
        <h1 className={styles.title}>TODOリスト</h1>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="新しいタスクを入力..."
            className={styles.input}
          />
          <button onClick={addTodo} className={styles.addButton}>
            追加
          </button>
        </div>

        <div className={styles.filterArea}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          >
            全て ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
          >
            未完了 ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
          >
            完了 ({completedCount})
          </button>
        </div>

        <div className={styles.todoList}>
          {filteredTodos.length === 0 ? (
            <p className={styles.emptyMessage}>
              {filter === 'all' && 'タスクがありません'}
              {filter === 'active' && '未完了のタスクはありません'}
              {filter === 'completed' && '完了したタスクはありません'}
            </p>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className={styles.checkbox}
                />
                <span className={todo.completed ? styles.completed : ''}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
