import './App.css'
import image from './../public/assets/react.svg';
import Button from './components/ui/Button'
import Cards from './components/ui/Cards'

function App() {
  return (
    <>
      <Cards name="Nom" url={image} alt="jsp"/>
      <h1>
        Hello World !
      </h1>
      <Button text="Click me"/>
    </>
  )
}

export default App
