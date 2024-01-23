import logger from '../config/logger';
import { Constants } from '../constants/constants';
import { DatabaseInitialization } from '../db/dbConnection';
import {
  Cms,
  ICmsQueryParams,
  ICreateCmsData,
  IUpdateCmsData,
} from '../db/entity/Cms';
class CmsService {
  cmsRepository = DatabaseInitialization.dataSource.getRepository(Cms);

  async getCms(reqQueryData: ICmsQueryParams) {
    logger.info(`Cms Service : getCms, `);
    const page: number = reqQueryData.page;
    const limit: number = reqQueryData.pageSize;
    const offset: number = (page - 1) * limit;
    const response = await this.cmsRepository.find({
      take: limit,
      skip: offset,
      select: ['contentType', 'contentData', 'language'],
      where: reqQueryData.language
        ? {
            language: reqQueryData['language'].toLowerCase(),
          }
        : {},
      order: {
        id: 'ASC',
      },
    });
    return response;
  }

  async getContentTypes() {
    logger.info(`Cms Service : getContentTypes`);
    const data = await this.cmsRepository.find({
      select: ['contentType', 'language'],
    });
    const response = data.map((item) => ({
      contentType: item.contentType,
      language: item.language,
    }));
    return response;
  }

  async getContentData(slug: string, language: string) {
    logger.info(
      `Cms Service : getContentData, slug : ${JSON.stringify(
        slug,
      )}, language : ${JSON.stringify(language)}`,
    );
    const data = await this.cmsRepository.findOne({
      select: ['contentType', 'contentData', 'language'],
      where: { contentType: slug, language },
    });
    return data;
  }

  async createCms(data: ICreateCmsData) {
    logger.info(`Cms Service : createCms, data : ${JSON.stringify(data)}`);
    const isAlreadyExist = await this.cmsRepository.findOne({
      where: { contentType: data.contentType, language: data.language },
    });
    if (isAlreadyExist) {
      return Constants.ErrorMessage.CONTENT_ALREADY_EXIST;
    }
    await this.cmsRepository
      .createQueryBuilder()
      .insert()
      .values(data)
      .execute();
    return;
  }

  async updateCms(contentType: string, language: string, data: IUpdateCmsData) {
    logger.info(
      `Cms Service : updateCms, data : ${JSON.stringify(
        data,
      )}, contentType: ${JSON.stringify(contentType)}`,
    );
    const updatedContent = await this.cmsRepository.update(
      { contentType, language },
      data,
    );
    return updatedContent.affected;
  }

  async deleteContent(slug: string, language: string) {
    logger.info(
      `Cms Service : deleteContent, slug : ${JSON.stringify(
        slug,
      )}, language : ${JSON.stringify(language)}`,
    );
    const deletedContent = await this.cmsRepository.delete({
      contentType: slug,
      language,
    });
    return deletedContent.affected;
  }
}

const cmsService: CmsService = new CmsService();
export default cmsService;
