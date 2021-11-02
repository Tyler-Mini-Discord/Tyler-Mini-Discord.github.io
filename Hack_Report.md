# Discord Hack Report
## XSS

All XSS attemps were unsuccessful due to my partners sanitizer function in their javascript. However, the sanitizer function itself left the site to be easily broken. When first creating an account, I immediately attempted to create an account that included XSS, causing the page to break and not load when first logging on, requiring him to manually delete my account.
![image](https://user-images.githubusercontent.com/65139765/139789533-ade280c6-8b8e-4a17-8897-987cda10aa6c.png)
When submitting messages with potential HTML, the santizer function would map the characters to descriptors of the characters.
![image](https://user-images.githubusercontent.com/65139765/139789755-d0c4e3c1-afb8-43da-ad01-057c37d70e2e.png)
![image](https://user-images.githubusercontent.com/65139765/139789782-6bb6c673-2648-406d-a5ec-64bf61c10576.png)

However, this led to many issues when it came to editing messages. If I went in and attempted to insert any of the characters included in the sanitizer function, whether for XSS purposes or not, it led to the message not being edited and the edit box staying on the screen.
![image](https://user-images.githubusercontent.com/65139765/139789865-d38f4dc6-462d-4862-b7d9-d696bd6d288a.png)

This is also evident in the create server settings when attempting XSS. The chat app will simply leave the box open and not create a new channel.

![image](https://user-images.githubusercontent.com/65139765/139790028-4b94bd88-644a-46f3-9da3-e86baf740d54.png)

XSS was the only security vulnerability I had the skill to try to implement as I do not understand security rules with firebase still, let alone how to change them.

## Functionality

The chat app, while having a very nice aesthetic, did have many functionality flaws aside from the ones caused by attempted XSS listed above. After attempting to add a channel with XSS and getting an error message, I thought that was the end of it. However, I went to go edit a message and the alert box continually pops up in an infinite loop, resulting in the inability to change the message or do anything else on the app.
![image](https://user-images.githubusercontent.com/65139765/139790418-d333cf27-ac0d-4719-be07-bce6fd775dc0.png)
Also, there is nothing stopping the user from creating multiple edit boxes by clicking on the edit button next to the message. The problem with this is, if you create more than one, no matter which box you put the edited text in, the original message will not change and all the edit boxes will remain on the screen. The only way to return it back to normal is to refresh the page or delete the message.
![image](https://user-images.githubusercontent.com/65139765/139790924-5fff2e8d-e1de-4276-813e-57ff2fd03714.png)

## Source Code Evaluation

Going through my partners commit history, it was very obvious that he took a very systematic and organized approach to this project. Including a to do list that he edited along the way, as well as descriptive commit messages to easily follow his progress, it was obvious he put in a great deal of effort and thought into every step of his project. It was 
