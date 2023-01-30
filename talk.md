Cross-site scripting (XSS) is when an attacker injects malicious scripts into your web application.
XSS is very common! Google has a bug bounty program. Until recently, XSS bugs were the #1 security bug.
XSS is also very dangerous.
Here is one example:
Imagine a popular e-commerce site.
The site uses the URL parameters to display the title of the product page.
For example, if I visit the gloves page, I will see "Product page: gloves". If I visit the "hat" page I will see "Product page: hat".
But the site also uses innerHTML. This is insecure. But maybe this is old code, and the security audit missed it, and no other developer noticed.
Now, Imagine I'm a user logged into the e-commerce site.
One day, I receive an email from my friend. My friend tells me "Check out this new product".
It's actually a phishing email, this is not my friend!
And this is not a normal link — this link contains a script in the URL.
But if I'm not careful, I click the link.
And boom!
Now, the attacker's script is running on the site.
Here, the XSS attack is just a window alert.
But a real attacker would do something dangerous here. For example, they would steal my credit card details on the page!
There are many different types of XSS. This is just one example.
So, how do you protect your application from XSS?
The answer is with layers. Security works in layers.
First security layer: sanitize.
But maybe you forgot to sanitize! Or maybe a new member of your team uses dangerouslySetInnerHTML in React!
So, you need a second security layer against XSS: this is CSP.
CSP has been around for some time.
Question for the audience: Who has heard about CSP? Who has implemented CSP?
When CSP was created in xxxx, this was the recommendation:
Declare which sources are allowed to load scripts.
BUT later, experts realized that this approach has problems:
First, it must be highly customized. 😓
Second, it doesn't effectively protect your site. ❌
Today I want to talk to you about the new recommendation. Today, security experts recommend strict CSP. It is the same web standard, but a different way to use it.
It doesn't need to be highly customized.
It protects your site more effectively.
With strict CSP, you now verify individual scripts.
Let me show a demo.
For this demo, let's assume this is a static site.
Again, this here is the problematic code.
To set up a strict CSP, what I need to do is to tell the browser strict CSP.
But I also have my own script here in my page! So I need to tell the browser to allow my own script. So, first I need to calculate the hash of my script. I can use a tool for that.
Then, I can add this hash to my strict-CSP. For extra security I will also add:
Object-src: this disable dangerous plugins such as Flash.
Base-uri: This blocks the injection of <base> tags which attackers can used to change the locations of scripts loaded from relative URLs.
This is just for one script. If I had several scripts, it would be more convenient to have one boss script to load others.
Add ?product=gloves🧤 to the home URL. This works (this changes the title of the page) even though this relies on innerHTML, because my script is doing this and it's allowed via hash.
Add ?product=<img src="" onerror="window.alert('XSS 🙀')" /> to the home URL. This time, we're asking the page to run a new script (window.alert) via our malicious event handler. The CSP refuses to execute this inline event handler (and all event handlers) because that would be an unallowed script (as in you can't / wouldn't want the system to rely on each event handler (script) having a hash, that would be impractical
Great, my site is now protected!
Note one important thing: Now, if I edit the code of my script. The CSP will reject it. Because by changing my script, I have changed the hash. But because of the CSP, the browser expects the content of my script to match exactly my hash. So the browser will refuse to run my script. This is intended!
OK, now, I explained the basics of strict CSP. Let's zoom out. If you want to adopt a strict CSP, here is what you should know:
In my small demo, you have seen that a CSP can break things. Because of this, it's a good idea to deploy a CSP in Report-Only mode first. Report-Only is a special mode where the CSP is not really enforced. But you will receive reports if the CSP was enforced. With Report-Only, you can test your policy in production without breaking anything, and understand what would break thanks to the reports, before you deploy your policy for real.
In my demo, I set the policy in a meta tag. It's more secure to set the policy in an HTTP header instead. So do that if you can.
In my demo, I only have a static page. But if you have server-side-rendering, your strict CSP should not use a hash (= which encodes the EXACT CONTENT of the script). Instead, use a nonce that's generated at runtime (= which only encodes a one-time ID for the script, it doesn't encode its content!). Make sure to use each nonces one time only. Otherwise an attacker can just learn your nonces and use them!
You can learn more about how to adopt a strict CSP in the article.
If you want to adopt a strict CSP in a React application, you can try our experimental plugin html-strict-webpack-plugin.
One very common vulnerability in modern frontend is DOM XSS. Actually, the example I showed you today was DOM XSS. BUT: CSP doesn't protect from all types of DOM XSS! If you want to be completely protected from DOM XSS, look into Trusted Types. Jack can help!
One last thing: Let's zoom out a little bit more: CSP is a weird API. It's old now. It has many use cases. Too many use cases. Developers often find CSP confusing. Because of this, our colleague Mike West proposed a new idea: Scripting policy. It's an early proposal. This is not implemented yet. But maybe this is the future of XSS protection on the web, with a nice developer experience. Check it out!
