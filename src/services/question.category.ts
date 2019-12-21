import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { IQuestionCategory, IQuestionCategoryDTO } from '../interfaces/IQuestionCategory';



@Service()
export default class QuestionCategoryService {
	constructor(
		@Inject('questionCategoryModel') private categoryModel: any,
		@Inject('logger') private logger,
		@EventDispatcher() private eventDispatcher: EventDispatcherInterface,
	) {

	}

	public async create(questionContentInput: IQuestionCategoryDTO): Promise<{ questionRecord: IQuestionCategory }> {
		try {
			this.logger.silly('Creating Category content');
			if (typeof questionContentInput.published === 'string') {
				questionContentInput.published = (questionContentInput.published == "on");
			}

			const questionRecord: IQuestionCategory = await this.categoryModel.create({
				...questionContentInput
			});

			if (!questionRecord) {
				throw new Error('Question Content cannot be created');
			}
			return { questionRecord };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	public async update(categoryId: number, categoryInput: IQuestionCategoryDTO): Promise<{ categoryRecord: IQuestionCategory }> {
		const categoryRecord: any = await this.categoryModel.findOne({
			where: {
				id: categoryId
			}
		});

		if (!categoryRecord) {
			throw new Error('Category not found.');
		}

		this.logger.silly('Updating question Category');

		if (typeof categoryInput.published === 'string') {
			categoryInput.published = (categoryInput.published == "on");
		}

		await categoryRecord.update(categoryInput);

		return { categoryRecord };

	}

	public async findBy_idFictitious(idFictitious: number): Promise<{ questionCategory: IQuestionCategory }> {
		try {
			this.logger.silly('Finding category');
			const questionCategory: IQuestionCategory = await this.categoryModel.findOne(
				{
					where: { idFictitious }
				}
			);
			return { questionCategory };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}


	public async findAll(): Promise<{ questionCategories: IQuestionCategory[] }> {
		try {
			this.logger.silly('Finding category');
			const questionCategories: IQuestionCategory[] = await this.categoryModel.findAll();
			return { questionCategories };
		}
		catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}