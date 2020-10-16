class Achievement
{
    constructor(title, description, html, checkCompleted)
    {
        this.title = title;
        this.description = description;
        this.checkCompleted = checkCompleted;
        this.html = html;
        this.isCompleted = false;
    }

    tick(dt)
    {
        if(!this.isCompleted)
        {
            this.isCompleted = this.checkCompleted();
        }
    }
}