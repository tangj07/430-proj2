const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState } = React;
import RecipeForm from './recipeForm.jsx';
import RecipeList from './recipeList.jsx';
import AccountDetails from './accountDetails.jsx';
import RecipeSearch from './recipeSearch.jsx'; 

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState('recipeForm'); 
    const [reloadRecipes, setReloadRecipes] = useState(false);
    const [recipes, setRecipes] = useState([]);

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'accountDetails':
                return <AccountDetails />;
            case 'recipeForm':
                return <RecipeForm triggerReload={() => setReloadRecipes(!reloadRecipes)} />;
            case 'recipeList':
                return <RecipeList recipes={recipes} reloadRecipes={reloadRecipes} />;
            case 'recipeSearch':
                return <RecipeSearch onSearchResults={setRecipes} />;
            default:
                return <RecipeForm triggerReload={() => setReloadRecipes(!reloadRecipes)} />;
        }
    };

    return (
        <div>
            <div className="dashboard-nav">
                <button className="btn btn-nav" onClick={() => setActiveComponent('recipeForm')}>Add Recipe</button>
                <button className="btn btn-nav" onClick={() => setActiveComponent('recipeList')}>View Recipes</button>
                <button className="btn btn-nav" onClick={() => setActiveComponent('recipeSearch')}>Search Recipes</button>
                <button className="btn btn-nav" onClick={() => setActiveComponent('accountDetails')}>Account Details</button>
            </div>
    
            <div className="dashboard-content">
                {renderActiveComponent()}
            </div>
        </div>
    );    
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<Dashboard />);
};

window.onload = init;