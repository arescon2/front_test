import { Button, ButtonGroup, Intent } from "@blueprintjs/core";

const CELL_COUNT = 7;
const CELL_MID_LEN = ~~(CELL_COUNT / 2);

const Pagination = ({ current, totalCount, onChangeCurrentPage }) => {
  const countPages = Math.ceil(totalCount / 3 );

  const preparePagesInfo = () => {
    let pages = [];
    if (countPages > CELL_COUNT) {

      pages[0] = { pageNumber: 1 }
      pages[1] = { pageNumber: 2 }
      pages[CELL_COUNT - 2] = { pageNumber: countPages - 1 }
      pages[CELL_COUNT - 1] = { pageNumber: countPages }

      if (current <= CELL_MID_LEN) {
        pages[CELL_COUNT - 2].ellipsis = true
        
        for (let index = 2; index < CELL_COUNT - 2; index++) pages[index] = { pageNumber: index + 1 };

      } else if ((countPages - current) < CELL_MID_LEN) {
        pages[1].ellipsis = true
        
        for (let index = 2; index < CELL_COUNT - 2; index++) pages[index] = { pageNumber: countPages - CELL_COUNT + index + 1 };

      } else {
        pages[1].ellipsis = true
        pages[CELL_COUNT - 2].ellipsis = true

        pages[CELL_MID_LEN] = { pageNumber: current }

        for (let index = 1; index < CELL_COUNT - 5; index++) {
          pages[CELL_MID_LEN + index] = { pageNumber: current + index }
          pages[CELL_MID_LEN - index] = { pageNumber: current - index }
        }
      }
    } else {
      for (let index = 0; index < countPages; index++) pages[index] = { pageNumber: index + 1, ellipsis: false };
    };

    return pages;
  };

  const preparedPages = preparePagesInfo();

  return <ButtonGroup className='pagination-block' minimal>
    <Button disabled={current === 1} text='<' onClick={() => { onChangeCurrentPage(current - 1) }}/>
    {preparedPages.map( page =>
      <Button
        key={page.pageNumber}
        text={page.ellipsis ? '...' : page.pageNumber}
        disabled={page.ellipsis}
        intent={page.pageNumber === current ? Intent.PRIMARY : Intent.DEFAULT}
        onClick={() => { onChangeCurrentPage(page.pageNumber) }}
      />
    )}
    <Button disabled={current === countPages} text='>' onClick={() => { onChangeCurrentPage(current + 1) }}/>
  </ButtonGroup>
};

export default Pagination;