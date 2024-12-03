import './App.css';
import MetamaskSignin from './pages/metamaskSignin';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>FreelanceDAO</h1>
          <MetamaskSignin />
        </div>
      </header>
    </div>
  );
};

export default App;
