import { Button, ButtonGroup, Icon, Tag } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./pagination";

import { setCurrentPage, setAppTitle, setOneTask, changeSorting } from '../stores/mainSlice';
import { useEffect } from "react";
import { onTaskEdit } from "../features/api";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const headerFields = [
  {
    title: 'id',
    name: 'id',
    width: '80px'
  },
  {
    title: 'Имя пользователя',
    name: 'username',
    width: '200px'
  },
  {
    title: 'email',
    name: 'email',
    width: '200px'
  },
  {
    title: 'Сообщение',
    name: 'text',
  },
  {
    title: 'Статус',
    name: 'status',
    width: '160px'
  }
];

let statusArray = {
  0: <Tag>задача не выполнена</Tag>,
  1: <Tag>задача не выполнена</Tag>,
  10: <Tag intent='success'>задача выполнена</Tag>,
  11: <Tag intent='success'>задача выполнена</Tag>
};

const ListTasks = ({ getTasks }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    listTasks, totalCountTasks, currentPage, auth_status,
    sort_field, sort_direction
  } = useSelector((state) => state.main);

  if(auth_status) {
    statusArray[1] = <><Tag>задача не выполнена</Tag><Tag intent='primary'>отредактирована админом</Tag></>;
    statusArray[11] = <><Tag intent='success'>задача выполнена</Tag><Tag intent='primary'>отредактирована админом</Tag></>;
  };

  const onChangeCurrentPage = (page) => {
    dispatch(setCurrentPage(page));
  };

  const onConfirmTaskHandler = (task) => {
    let status = {
      0: 10,
      1: 11,
      10: 11,
      11: 11
    }[task.status];

    onTaskEdit(task.id, false, status).then( ({status}) => {
      if(status === 'ok') toast.success('Статус изменен');
      if(status === 'error') {
        toast.error('Ошибка валидации пользователя')
        navigate('/login');
      };
    });
    getTasks();
  };

  const onOpenTask = (task) => {
    dispatch(setOneTask(task));
    navigate('/task/' + task.id);
  };

  const onSortingHandler = (column) => {
    let sort_local_field = sort_field;
    let sort_local_direction = sort_direction;
    if(column === sort_local_field) sort_local_direction = sort_direction === 'asc' ? 'desc' : 'asc';
      else {
        sort_local_field = column;
        sort_local_direction = 'asc';
      }
    dispatch(changeSorting({
      sort_field: sort_local_field,
      sort_direction: sort_local_direction
    }));
  };

  useEffect(() => { dispatch(setAppTitle('Список задач')) }, []);

  return <>
    <table className="bp3-html-table bp3-html-table-bordered bp3-interactive table-lists">
      <thead>
        <tr>
          {
            headerFields.map( ({ title, name, width }, indexField) => {
              let styles = width ? {
                width: width
              } : {};
              let isSortingColumn = sort_field === name;
              return <th onClick={() => onSortingHandler(name)} style={styles} key={indexField + 'field'}>
                  {title}
                  {isSortingColumn ? <Icon style={{ float: 'right' }} icon={ sort_direction === 'asc' ? 'sort-asc' : 'sort-desc'} /> : ''}
                </th>
            })
          }
          {
            auth_status ? <th>
              Действия
            </th> : null
          }
        </tr>
      </thead>
      <tbody>
        {
          listTasks.map( (task, indexTask) => {
            let isSuccesTask = task.status === 10 || task.status === 11;
            return <tr key={indexTask + 'Task'}>
              {
                headerFields.map( ({ name, width }, indexField) => {
                  let styles = width ? {
                    width: width
                  } : {};
                  return <td style={styles} key={indexField + 'field'}>
                    {
                      name === 'status' ?
                        statusArray[task[name]] :
                          task[name]
                    }
                  </td>
                })
              }
              {
                auth_status ? <td>
                  <ButtonGroup>
                    <Button intent='primary' outlined small icon='edit' onClick={() => onOpenTask(task)} placeholder='Редактирование' />
                    {
                      !isSuccesTask ? <Button
                        intent='success'outlined small icon='confirm' placeholder='Выполнено'
                        onClick={() => onConfirmTaskHandler(task)}
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
          <td colSpan={3}></td>
          <td>Всего задач:</td>
          <td>{totalCountTasks}</td>
        </tr>
      </tfoot>
    </table>
    <Pagination current={currentPage} totalCount={totalCountTasks} onChangeCurrentPage={onChangeCurrentPage} />
  </>
};

export default ListTasks;