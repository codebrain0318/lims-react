import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const Reason = () => {

    const ref = useRef();

    return (
        <section id="reason" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.Reason.title}</Typography>
            <Box p={3}>
                <img src={HelpData.Reason.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.Reason.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.Reason.create_description}</Box>
                        <img src={HelpData.Reason.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.Reason.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.Reason.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default Reason;