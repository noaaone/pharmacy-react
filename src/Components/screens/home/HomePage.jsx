import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (

    <div className='homeBody'><header>
      <div className="logo">
        <Link to="/"><p>Pharmacy+</p></Link>
      </div>
      <div className="buttons">
        <Link to="/authorization"><button>Войти</button></Link>
        <Link to="/registration"><button>Зарегистрироваться</button></Link>
      </div>
    </header><div className="main">
        <h1 className="heading">Следите за ценообразованием</h1>
        <img className="image" src="/images/dynamic.jpg" alt="График цен"></img>
        <p className='pHome'> Наши инновационные инструменты для анализа и мониторинга процесса ценообразования позволяют быть в курсе всех изменений, происходящих на рынке.
          Наша команда экспертов по ценовой политике и маркетинговых исследований тщательно анализирует и интерпретирует данные, чтобы предоставлять вам наиболее точную информацию.
          Мы обновляем нашу информацию о ценах каждую неделю.</p>
        <h1 className="heading">Получайте платный анализ</h1>
        <img className="image" src="/images/expertView.jpg" alt="Мнение эксперта"></img>
        <p className='pHome'> Получайте платный анализ от ведущих специалистов в области. Наши эксперты работают над тем, чтобы вы получали самые свежие и важные новости и рекомендации.</p>

      </div><div className="footer_bottom">

        <div className="footer_cont">

          <div className="text"><p className="text">18+</p><p className="text">Информация о товарах носит ознакомительный характер.</p>


            <p >© Pharmacy+ 2024. Все права защищены</p></div>



        </div>

      </div></div>

  );
}

export default Home;