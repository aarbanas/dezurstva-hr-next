import {
  APIs,
  deleteRequest,
  get,
  post,
} from '@/shared/http-service/httpService';
import {
  CertificateDto,
  CreateCertificateDto,
} from '../models/certificate.model';

const fetchCertificates = async (
  userId: number
): Promise<CertificateDto[]> => {
  return get<CertificateDto[]>(`${APIs.CERTIFICATE}?userId=${userId}`);
};

const createCertificate = async (
  certificate: CreateCertificateDto
): Promise<CertificateDto> => {
  return post(APIs.CERTIFICATE, certificate);
};

const downloadCertificate = async (certificateId: number) => {
  const certificateURL = await get<string>(
    `${APIs.CERTIFICATE_FILES}/${certificateId}/download`
  );

  const response = await fetch(certificateURL);
  const certificate = await response.arrayBuffer();

  const contentType = response.headers.get('Content-Type') || '';
  const blob = new Blob([certificate], {
    type: contentType,
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate`;
  a.click();
};

const deleteCertificate = async (certificateId: number) => {
  await deleteRequest(`${APIs.CERTIFICATE}/${certificateId}`);
};

export {
  fetchCertificates,
  createCertificate,
  downloadCertificate,
  deleteCertificate,
};