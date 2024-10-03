import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const dayjsExt = dayjs;

dayjs.locale('ru');
dayjs.extend(customParseFormat);

export { dayjsExt };
