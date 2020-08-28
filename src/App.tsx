import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import Grid from './components/Grid';
import {GridColumn, GridFilter, GridItemData} from './components/Grid/Grid';

interface UserItemData extends GridItemData {
  id: number;
  name: string;
  surname: string;
}

const userColumns: GridColumn[] = [
  {
    id: 'id',
    title: '#',
  },
  {
    id: 'name',
    title: 'Имя',
  },
  {
    id: 'surname',
    title: 'Фамилия',
  },
];

const userData: UserItemData[] = [
  {
    id: 1,
    name: 'Петр',
    surname: 'Иванов',
  },
  {
    id: 2,
    name: 'Иван',
    surname: 'Петров',
  },
  {
    id: 3,
    name: 'Максим',
    surname: 'Максимов',
  },
];

const userFilter: GridFilter<UserItemData> = (item, filterText) => {
  const filterTextLowerCase = filterText.toLowerCase();
  return item.name.toLowerCase().includes(filterTextLowerCase)
    || item.surname.toLowerCase().includes(filterTextLowerCase);
}

function App() {
  return (
    <div className="container py-5">
      <h1>Список пользователей</h1>
      <div className="row">
        <div className="col-sm">
          <Grid<UserItemData>
            columns={userColumns}
            data = {userData}
            filter={userFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
