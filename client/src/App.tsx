import HabitContainer from 'habits/HabitContainer';
import SignUp from 'pages/SignUp';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

const queryClient = new QueryClient()
function App() {
     return (
      <QueryClientProvider client={queryClient}>
          <div className='w-full p-4 mx-auto'>
            <HabitContainer />
          </div>
       <Routes>
          <Route path='signup' element={<SignUp />} />
       </Routes>
      </QueryClientProvider>
  );
}

export default App;
