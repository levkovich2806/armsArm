'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

// URL защищенного API
const API_URL = 'https://212.127.78.182:8444/arm/v1/user';

interface User {
  // Замените на реальную структуру вашего объекта пользователя
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      console.log('Attempting to fetch user data...');
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Accept': 'text/html;application/json', // 👈 ключевой момент
          },
        });

        console.log('Response:', response);

        // Если ответа нет (статус 0) или это непрозрачный редирект,
        // браузер сам обработает перенаправление на страницу логина.
        // fetch в этом случае вызовет ошибку, которая будет поймана в catch.
        if (!response.ok) {
          // Этот блок сработает, если API вернет ошибку (например, 401/403) без редиректа.
          setError(`Ошибка аутентификации: Статус ${response.status}. Ожидается редирект...`);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
        console.log('User data fetched successfully:', data);
      } catch (e) {
        // Эта ошибка, скорее всего, означает, что браузер инициировал
        // перенаправление на страницу входа из-за cross-origin политики.
        // Ничего делать не нужно, пользователь вернется сюда после логина.
        console.error('Fetch failed, likely due to auth redirect:', e);
        setError('Перенаправление на страницу аутентификации...');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится один раз при монтировании

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>ARM</h1>
        {isLoading && <p>Загрузка данных пользователя...</p>}
        {error && !user && <p>{error}</p>}
        {user && (
          <div>
            <h2>Добро пожаловать!</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
