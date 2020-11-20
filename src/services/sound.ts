import { Service, Inject } from 'typedi';
import { ISound, ISoundInputDTO } from '../interfaces/ISound';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class SoundService {
    public constructor(
        @Inject('soundModel') private soundModel: Models.SoundModel,
        @Inject('contentSoundModel') private contentSoundModel: Models.ContentSoundModel,
        @Inject('questionSoundModel') private questionSoundModel: Models.QuestionSoundModel,
        @Inject('thematiqueSoundModel') private thematiqueSoundModel: Models.ThematiqueSoundModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async create(soundInput: ISoundInputDTO): Promise<{ sound: ISound }> {
        try {
            this.logger.silly('Creating sound', soundInput);

            const sound: ISound = await this.soundModel.create({
                ...soundInput,
            });

            if (!sound) {
                throw new Error('Sound cannot be created');
            }

            return { sound };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(soundId: number, soundInput: ISoundInputDTO): Promise<{ sound: ISound }> {
        const sound = await this.soundModel.findOne({
            where: {
                id: soundId,
            },
        });

        if (!sound) {
            throw new Error('Sound not found.');
        }

        this.logger.silly('Updating sound');
        const updatedSound: ISound = await sound.update(soundInput);

        if (!updatedSound) {
            throw new Error('Sound could not be updated.');
        }

        return { sound: updatedSound };
    }
    
    public async handleContentSound(contentId, soundId)
    {
		const contentSoundInput = {
			contentId: contentId,
			soundId: soundId,
		}
		
		const contentSound = await this.contentSoundModel.create({
            ...contentSoundInput,
        });

        if (!contentSound) {
            throw new Error('Content Sound cannot be created');
        }

        return { contentSound };
	}
	
	public async deleteContentSound(contentId, soundId)
	{
		await this.contentSoundModel.destroy({ where: {contentId: contentId, soundId: soundId}}) ;
	}
	
	public async deleteQuestionSound(questionId, soundId)
	{
		await this.questionSoundModel.destroy({ where: {questionId: questionId, soundId: soundId}}) ;
	}
	
	public async deleteThematicSound(thematicId, soundId)
	{
		await this.thematiqueSoundModel.destroy({ where: {thematiqueId: thematicId, soundId: soundId}}) ;
	}
    
    public async handleQuestionSound(questionId, soundId, soundType)
    {
		const questionSoundInput = {
			questionId: questionId,
			soundId: soundId,
			soundType: soundType,
		}
		
		const questionSound = await this.questionSoundModel.create({
            ...questionSoundInput,
        });

        if (!questionSound) {
            throw new Error('Question Sound cannot be created');
        }

        return { questionSound };
	
    }
    
    public async handleThematicSound(thematicId, soundId)
    {
		const thematicSoundInput = {
			thematiqueId: thematicId,
			soundId: soundId,
		}
		
		const thematicSound = await this.thematiqueSoundModel.create({
            ...thematicSoundInput,
        });

        if (!thematicSound) {
            throw new Error('Question Sound cannot be created');
        }

        return { thematicSound };
	
    }
}
