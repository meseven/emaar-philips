import Header from 'components/Header';

function Dashboard({ children }) {
  return (
    <div className="container-wrapper">
      <Header />

      {children}
    </div>
  );
}

export default Dashboard;
