import React from 'react';
// import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Button from 'react-md/lib/Buttons';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

import AppStore from '../store/app-store';

@observer
class FavoriteRules extends React.Component {
  onClearClick() {
    AppStore.clear();
  }

  onRowSelection = (rowId, checked/* , selCount, e */) => {
    if (rowId === 0) {
      AppStore.selectedRules = checked ?
        AppStore.favorites.slice() :
        [];
    } else if (checked) {
      AppStore.addSelection(AppStore.favorites[rowId - 1]);
    } else {
      AppStore.removeSelection(AppStore.favorites[rowId - 1]);
    }
  }

  renderListHeadRow(n) {
    return Object.keys(n).map(i => (
      <TableColumn key={i}>{i}</TableColumn>
    ));
  }

  renderListRow(n) {
    return Object.values(n).map((v, i) => {
      const key = `${n.id}${i}`;
      return (
        <TableColumn key={key}>{v}</TableColumn>
      );
    });
  }

  renderList() {
    const first = AppStore.favorites.length ? (AppStore.favorites[0] || {}) : {};
    return (
      <DataTable
        baseId="favorite-rules-table"
        selectableRows
        onRowToggle={this.onRowSelection}
      >
        <TableHeader>
          <TableRow>
            {this.renderListHeadRow(first)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {AppStore.favorites.map(n => (
            <TableRow key={n.id}>
              {this.renderListRow(n)}
            </TableRow>
            ))}
        </TableBody>
      </DataTable>
    );
  }

  render() {
    return (
      <div className="md-grid">
        <div className="md-cell--12">
          { this.renderList() }
        </div>

        <div className="md-cell--3">
          <Button raised onClick={this.onClearClick}>Clear</Button>
        </div>
      </div>
    );
  }
}

// FavoriteRules.propTypes = {
//   content: PropTypes.string
// };

// FavoriteRules.defaultProps = {
//   content: ''
// };

export default FavoriteRules;
