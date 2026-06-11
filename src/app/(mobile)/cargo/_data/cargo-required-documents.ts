import type { RequiredCargoDocument } from '../_types/cargo';
import { driverMock, vehicleMock } from './cargo-driver.mock';

export const requiredDriverDocuments: RequiredCargoDocument[] = [
    {
        id: 'driver-license',
        title: 'Водительское удостоверение',
        description: 'Основной документ водителя для допуска к рейсу.',
        scope: 'driver',
        ownerLabel: driverMock.fullName,
        numberLabel: 'Номер водительского удостоверения',
        expiryLabel: 'Срок действия удостоверения',
        helperText:
            'Проверьте номер документа и срок действия перед отправкой на проверку.',
    },
    {
        id: 'medical-certificate',
        title: 'Медицинская справка',
        description: 'Актуальная справка для работы на грузовом транспорте.',
        scope: 'driver',
        ownerLabel: driverMock.fullName,
        numberLabel: 'Номер медицинской справки',
        expiryLabel: 'Срок действия справки',
        helperText:
            'Укажите данные справки так, как они указаны в оригинале документа.',
    },
    {
        id: 'identity-document',
        title: 'Удостоверение личности или ИИН',
        description: 'Подтверждение личности водителя для проверки профиля.',
        scope: 'driver',
        ownerLabel: driverMock.fullName,
        numberLabel: 'Номер документа или ИИН',
        expiryLabel: 'Дата актуальности документа',
        helperText:
            'Заполните реквизиты документа внимательно, без сокращений и ошибок.',
    },
];

export const requiredVehicleDocuments: RequiredCargoDocument[] = [
    {
        id: 'truck-registration',
        title: 'СТС тягача',
        description: 'Свидетельство о регистрации закрепленного тягача.',
        scope: 'vehicle',
        ownerLabel: `${vehicleMock.model} • ${vehicleMock.plateNumber}`,
        numberLabel: 'Номер СТС тягача',
        expiryLabel: 'Срок действия СТС',
        helperText:
            'Укажите данные тягача так, как они указаны в регистрационных документах.',
    },
    {
        id: 'trailer-registration',
        title: 'СТС прицепа',
        description: 'Свидетельство о регистрации прицепа или полуприцепа.',
        scope: 'vehicle',
        ownerLabel: vehicleMock.trailerNumber,
        numberLabel: 'Номер СТС прицепа',
        expiryLabel: 'Срок действия СТС прицепа',
        helperText:
            'Проверьте номер и срок действия прицепа перед отправкой документов.',
    },
    {
        id: 'insurance-policy',
        title: 'Страховой полис',
        description: 'Полис на машину и перевозку для выхода в рейс.',
        scope: 'vehicle',
        ownerLabel: `${vehicleMock.model} • ${vehicleMock.plateNumber}`,
        numberLabel: 'Номер страхового полиса',
        expiryLabel: 'Срок действия полиса',
        helperText:
            'Убедитесь, что полис действителен на весь период работы в рейсе.',
    },
];

export const requiredCargoDocuments: RequiredCargoDocument[] = [
    ...requiredDriverDocuments,
    ...requiredVehicleDocuments,
];
