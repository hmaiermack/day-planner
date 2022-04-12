import HabitContainer from 'habits/HabitContainer';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()
function App() {
     return (
       <QueryClientProvider client={queryClient}>
        <div className='w-full p-4 mx-auto'>
          <HabitContainer />
        </div>
       </QueryClientProvider>
  );
}

export default App;
