import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import { Box, Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

import { createClient, getClientsData, deleteClient, uploadFile } from '../../slices/client';
import { ClientHeader } from '../../utils/tableHeaders';
import ClientModal from '../../components/lims-modals/ClientModal';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const Client = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [clientId, setClientId] = React.useState(0);
    const [id, setId] = React.useState('');

    const { clients, export_all_data } = useSelector(state => state.client);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getClientsData());
        }
    }, [dispatch, isAuthenticated]);

    const handleCreate = async (val) => {
        try {
            // if (users.filter(user => user.user_id === val.user_id).length > 0) {
            //     toast.error('User ID has been already existed');
            //     return;
            // }
            if (id !== '') {
                val.id = id;
            }
            dispatch(createClient(val));
            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const on_create_clicked = () => {
        let _id = 1;
        if (clients.filter(c => c.name !== 'Default').length > 0) {
            const max_id = Math.max.apply(Math, clients.map(data => data.clientId));
            if (max_id === clients.filter(c => c.name !== 'Default').length) {
                _id = max_id + 1;
            } else {
                var a = clients.map(data => Number(data.clientId));
                var missing = new Array();

                for (var i = 1; i <= max_id; i++) {
                    if (a.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                _id = Math.min.apply(Math, missing)
            }
        }
        setClientId(_id);
        setOpen(true);
        setId('')
    }

    const handleDeleteClient = (id) => {
        if (window.confirm('Do you really want to delete current client?')) {
            dispatch(deleteClient(id));
        }
    }

    const handleFiles = async (files) => {
        try {
            var reader = new FileReader();
            reader.readAsText(files[0]);
            const result = await new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    resolve(reader.result);
                }
            });

            dispatch(uploadFile(result));
        } catch (err) {
            console.log(err);
            toast.error('File import error');
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex">
                    <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                        <Button size='small' variant='contained'><UploadIcon />&nbsp;{t('Import')}</Button>
                    </ReactFileReader>
                    <Button size='small' variant='contained' sx={{ mx: 2 }} onClick={() => csvLink.current.link.click()}>
                        <DownloadIcon />&nbsp;{t('Export')}
                    </Button>
                    <Button size='small' variant='contained' onClick={on_create_clicked}><AddIcon />&nbsp;{t('Create New')}</Button>
                    <CSVLink
                        headers={ClientHeader(t).filter(col => col.key !== 'buttonGroups')}
                        filename="Export-Client.csv"
                        data={export_all_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={clients.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value) & setPage(0)}
                    className={classes.pagination}
                />
            </Box>
            <TableContainer>
                <Table aria-label="table">
                    <TableHead>
                        <TableRow>
                            {ClientHeader(t)
                                .filter(col => col.key !== '_id')
                                .map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.filter(c => c.name !== 'Default').length > 0 ? clients
                            .filter(c => c.name !== 'Default')
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align='left'>{row.name}</TableCell>
                                        <TableCell align='right'>{row.clientId}</TableCell>
                                        <TableCell align='right'>{row.other}</TableCell>
                                        <TableCell align='right'>{row.countryB}</TableCell>
                                        <TableCell align='right'>{row.zipCodeB}</TableCell>
                                        <TableCell align='right'>{row.cityB}</TableCell>
                                        <TableCell align='right'>{row.addressB}</TableCell>
                                        <TableCell align='right'>{row.address2B}</TableCell>
                                        <TableCell align='right'>{row.address3B}</TableCell>
                                        <TableCell align='right'>{row.address_street}</TableCell>
                                        <TableCell align='right'>{row.email}</TableCell>
                                        <TableCell align='right'>{row.email2}</TableCell>
                                        <TableCell align='right'>{row.email3}</TableCell>
                                        <TableCell align='right'>{row.remark1}</TableCell>
                                        <TableCell align='right'>{row.remark2}</TableCell>
                                        <TableCell align='right' sx={{ minWidth: '125px' }}>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => handleDeleteClient(row._id)}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell align="center" colSpan={16}>No Data</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                open && <ClientModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    selectedId={clientId}
                    id={id}
                />
            }
        </Box>
    )
}

export default Client;