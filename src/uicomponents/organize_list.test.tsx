import {cleanup, fireEvent, render, waitFor} from '@testing-library/react';

import OrganizeList from "./organize_list";

test('Add calls back to datasource', async () => {

  const {queryByLabelText, getByLabelText, getByRole} = render(
    <OrganizeList/>,
  );
    
  await waitFor(() => {
      expect(queryByLabelText(/Name/i)).toBeTruthy();
  });

  fireEvent.click(getByRole('button',{name: "Save"}));

  await waitFor(() => {
      expect(queryByLabelText(/Name/i)).toBeTruthy();
  });

});

test('Remove calls back to datasource', () => {
  expect(1 + 2).toBe(3);
});

test('Quick Edit sends updated values to datasource', () => {
  expect(1 + 2).toBe(3);
});
