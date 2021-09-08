import { useEffect } from 'react';
import { Chart, Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { HoverableBox } from "../../components/MotionElements";
import Loading from "../Loading";
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(annotationPlugin);

export default function LineChart({ fetching, callback, data, annotations, ...props }) {
    useEffect(() => {
        const zoomPluginPromise = import('chartjs-plugin-zoom');
        zoomPluginPromise.then((zoomPlugin) => {
            Chart.register(zoomPlugin);
            console.log(zoomPlugin);
            console.log(annotationPlugin);
        });
    }, []);
    const delayBetweenPoints = 0;
    //const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
                return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                //from: previousY,
                delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
                }
            }
    };
    const chartOptions = {
        //animation: false,
        animation,
        spanGaps: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            annotation: {
                annotations: annotations
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                    speed: 100
                },
                pan: {
                    enabled: true,
                    mode: "xy",
                    speed: 100
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    beginAtZero: false,
                    callback: callback,
                },
                //min: 0,
                //max: 100
            },
            x: {
                grid: {
                    display: false,
                },
                type: "timeseries",
                ticks: {
                    source: "data",
                },
            },
        },
        animations: {
            radius: {
                duration: 1000,
                easing: "linear",
                from: 5,
                to: 3,
                loop: true,
            },
        },
    };
    return (
    <>
        {fetching ? (
        <Loading />
        ) : (
        <HoverableBox {...props}>
            <Line data={data} options={chartOptions} />
        </HoverableBox>
        )}
    </>
    );
}
