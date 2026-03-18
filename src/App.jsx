import Header from './components/Header';
import Welcome from './components/Welcome';
import Footer from './components/Footer';



function App() {
  return (
    
    <div>
      
      {/* 
        Using components is just like using HTML tags,
        but they start with UpperCase and are self-closing
        when they have no children
      */}
      <Header />
      
      <main>
        <Welcome />
      </main>
      
      <Footer />
      
    </div>
  );
}
//available to main.jsx to import and render in the DOM
export default App;