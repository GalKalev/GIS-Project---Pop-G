import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BarChartIcon from '@mui/icons-material/BarChart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';


export const FavoriteIcon = ({ style, title, fontSize }) => (
    <FavoriteBorderIcon
        title={title}
        fontSize={fontSize}
        sx={style}
    />
)
export const StatsIcon = ({ style, title, fontSize }) => (
    <BarChartIcon
        title={title}
        fontSize={fontSize}
        sx={style} />
)

export const CompCountriesIcon = ({ style, title, fontSize }) => (
    <SwapHorizIcon
        title={title}
        fontSize={fontSize}
        sx={style}
    />
)