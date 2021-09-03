import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import { HoverableBox } from '../../components/MotionElements';
import Loading from '../Loading';


export default function LineChart ({ fetching, callback, data, ...props }) {
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                ticks: {
                    beginAtZero: false,
                    callback: callback,
                },
            },
            x: {
                type: 'timeseries',
            }
        },
        animations: {
            radius: {
                duration: 1000,
                easing: 'linear',
                from: 5,
                to: 3,
                loop: true
            }
        },
    };
    return (
        <> {fetching ?
        <Loading />
        :
        <HoverableBox {...props} >
            <Line data={data} options={options} />
        </HoverableBox>
        } </>
)}