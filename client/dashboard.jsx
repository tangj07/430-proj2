const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState } = React;
import RecipeForm from './recipeForm.jsx';
import RecipeList from './recipeList.jsx';
import AccountDetails from './accountDetails.jsx';
import RecipeEdit from './recipeEdit.jsx'; 
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
            case 'recipeEdit':
                return <RecipeEdit recipeId={1} onRecipeUpdated={() => setReloadRecipes(!reloadRecipes)} />;
            case 'recipeSearch':
                return <RecipeSearch onSearchResults={setRecipes} />;
            default:
                return <RecipeForm triggerReload={() => setReloadRecipes(!reloadRecipes)} />;
        }
    };

    return (
        <div>
            <div className="dashboard-nav">
                <button onClick={() => setActiveComponent('recipeForm')}>Add Recipe</button>
                <button onClick={() => setActiveComponent('recipeList')}>View Recipes</button>
                <button onClick={() => setActiveComponent('recipeSearch')}>Search Recipes</button>
                <button onClick={() => setActiveComponent('recipeEdit')}>Edit Recipe</button>
                <button onClick={() => setActiveComponent('accountDetails')}>Account Details</button>
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