import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Icon, Tag } from '@blueprintjs/core';
import Pagination from './pagination';

import { setCurrentPage, setAppTitle, setOneTask, changeSorting } from '../stores/mainSlice';
import { useEffect } from 'react';
import { onTaskEdit } from '../features/api';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const headerFields = [
  {
    title: 'Имя пользователя',
    name: 'username',
    width: '200px'
  },
  {
    title: 'Email',
    name: 'email'
  },
  {
    title: 'Текст задачи',
    name: 'text'
  },
  {
    title: 'Статус',
    name: 'status',
    width: '200px'
  }
];

const statusArray = {
  0: <Tag>задача не выполнена</Tag>,
  1: <Tag>задача не выполнена</Tag>,
  10: <Tag intent='success'>задача выполнена</Tag>,
  11: <Tag intent='success'>задача выполнена</Tag>
};

const ListTasks = ({ getTasks }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    listTasks, totalCountTasks, currentPage, authStatus,
    sortField, sortDirection
  } = useSelector((state) => state.main);

  if(authStatus) {
    statusArray[ 1 ] = <><Tag>задача не выполнена</Tag><Tag intent='primary'>отредактирована админом</Tag></>;
    statusArray[ 11 ] = <><Tag intent='success'>задача выполнена</Tag><Tag intent='primary'>отредактирована админом</Tag></>;
  }

  const onChangeCurrentPage = (page) => {
    dispatch(setCurrentPage(page));
  };

  const onConfirmTaskHandler = async (task) => {
    const localStatus = {
      0: 10,
      1: 11,
      10: 11,
      11: 11
    }[ task.status ];

    await onTaskEdit(task.id, false, localStatus).then( ({ status }) => {
      if(status === 'ok') toast.success('Статус изменен');
      if(status === 'error') {
        toast.error('Ошибка валидации пользователя')
        navigate('/login');
      }
    });
    await getTasks();
  };

  const onOpenTask = (task) => {
    dispatch(setOneTask(task));
    navigate('/task/' + task.id);
  };

  const onSortingHandler = (column) => {
    let sortLocalField = sortField;
    let sortLocalDirection = sortDirection;
    if(column === sortLocalField) sortLocalDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      else {
        sortLocalField = column;
        sortLocalDirection = 'asc';
      }
    dispatch(changeSorting({
      sortField: sortLocalField,
      sortDirection: sortLocalDirection
    }));
  };

  useEffect(() => { dispatch(setAppTitle('Список задач')) }, []);

  return <>
		<table className='bp3-html-table bp3-html-table-bordered bp3-interactive table-lists'>
			<thead>
				<tr>
					{
						headerFields.map( ({ title, name, width }) => {
							const styles = width ? {
								width: width
							} : {};
							const isSortingColumn = sortField === name;
							return <th onClick={ () => onSortingHandler(name) } style={ styles } key={ name + 'field' }>
								{title}
								{isSortingColumn ? <Icon style={ { float: 'right' } } icon={ sortDirection === 'asc' ? 'sort-asc' : 'sort-desc' } /> : ''}
							</th>
						})
					}
					{
						authStatus ? <th>
								Действия
						</th> : null
					}
				</tr>
			</thead>
			<tbody>
				{
					listTasks.map( (task) => {
						const isSuccesTask = task.status === 10 || task.status === 11;
						return <tr key={ task.id + 'Task' }>
							{
								headerFields.map( ({ name, width }) => {
									const styles = width ? {
										width: width
									} : {};
									return <td style={ styles } key={ task.id + name + 'field' }>
										{
											name === 'status' ?
												statusArray[ task[ name ] ] :
													task[ name ]
										}
									</td>
								})
							}
								{
								authStatus ? <td>
										<ButtonGroup>
												<Button intent='primary' outlined small icon='edit' onClick={ () => onOpenTask(task) } placeholder='Редактирование' />
												{
											!isSuccesTask ? <Button
												intent='success'outlined small icon='confirm' placeholder='Выполнено'
												onClick={ () => onConfirmTaskHandler(task) }
											/> : null
										}
										</ButtonGroup>
								</td> : null
							}
						</tr>
					})
				}
			</tbody>
			<tfoot>
				<tr>
					<td colSpan={ 2 }></td>
					<td>Всего задач:</td>
					<td>{totalCountTasks}</td>
				</tr>
			</tfoot>
		</table>
		<Pagination current={ currentPage } totalCount={ totalCountTasks } onChangeCurrentPage={ onChangeCurrentPage } />
  </>
};

ListTasks.propTypes = {
  getTasks: PropTypes.func
}

export default ListTasks;