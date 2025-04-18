use anchor_lang::prelude::*;

declare_id!("A8DkqbrM8cz1wvBxv9CzR8SfeZA95LsB7WCxjxDTurMX");

#[program]
pub mod basic {
    use super::*;

    pub fn create_note(ctx: Context<CreateNote>, title: String, content_hash: String) -> Result<()>{
        let note = &mut ctx.accounts.note;
        note.author = *ctx.accounts.author.key;
        note.title = title;
        note.content_hash = content_hash;
        note.timestamp = Clock::get()?.unix_timestamp;
        note.hidden = false;

        Ok(())
    }

    pub fn update_note(ctx: Context<UpdateNote>, title: String, content_hash: String) -> Result<()> {
        let note = &mut ctx.accounts.note;
        require_keys_eq!(note.author, ctx.accounts.author.key(), CustomError::Unauthorized);
        note.title = title;
        note.content_hash = content_hash;
        note.timestamp = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn hide_note(ctx: Context<HideNote>) -> Result<()> {
        let note = &mut ctx.accounts.note;
        require_keys_eq!(note.author, ctx.accounts.author.key(), CustomError::Unauthorized);
        note.hidden = true;

        Ok(())
    }

    pub fn show_note(ctx: Context<HideNote>) -> Result<()> {
        let note = &mut ctx.accounts.note;
        require_keys_eq!(note.author, ctx.accounts.author.key(), CustomError::Unauthorized);
        note.hidden = false;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNote<'info> {
    #[account(
        init, 
        payer = author, 
        space = 8 + Note::INIT_SPACE
    )]
    pub note: Account<'info, Note>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateNote<'info> {
    #[account(mut)]
    pub note: Account<'info, Note>,
    pub author: Signer<'info>
}

#[derive(Accounts)]
pub struct HideNote<'info> {
    #[account(mut)]
    pub note: Account<'info, Note>,
    pub author: Signer<'info>
}

#[derive(Accounts)]
pub struct ShowNote<'info> {
    #[account(mut)]
    pub note: Account<'info, Note>,
    pub author: Signer<'info>
}

#[account]
#[derive(InitSpace)]
pub struct Note {
    pub author: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(255)]
    pub content_hash: String,
    pub timestamp: i64,
    pub hidden: bool,
}

#[error_code]
pub enum CustomError{ 
    #[msg("You are not unauthorized to modify this note.")]
    Unauthorized,
}
