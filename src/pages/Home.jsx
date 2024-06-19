import React from 'react';
import './styles/Home.css';
import { Link, NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home_main_container">
        <p className='home_p'>Projet de Recherche Operationelle</p>
      <div className="home_main_content">
        <div className="graphPage_container">
          <Link
            className="graphPages_main_btn home_general_btn
          "
            to="/GraphPage"
          >
            Algorithmes des graphes
          </Link>
        </div>
        <div className="pertMethode_container">
          <Link
            className="methodePert_main_btn home_general_btn"
            to="/PertPage"
          >
            Methode PERT
          </Link>
        </div>
        <div className="pertMethode_container">
          <Link
            className="methodeSimplexe_main_btn home_general_btn"
            to="/SimplexePage"
          >
            Methode Simplexe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
