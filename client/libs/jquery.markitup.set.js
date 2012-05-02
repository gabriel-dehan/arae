// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Html tags
// http://en.wikipedia.org/wiki/html
// ----------------------------------------------------------------------------
// Basic set. Feel free to add more tags
// ----------------------------------------------------------------------------
var mySettings = {
	onShiftEnter:  	{keepDefault:false, replaceWith:'<br />\n'},
	onCtrlEnter:  	{keepDefault:false, openWith:'\n<p>', closeWith:'</p>'},
	onTab:    		{keepDefault:false, replaceWith:'    '},
    previewInDocument: true,
    previewAutoRefresh: true,
    previewOpen: true,
	markupSet:  [
        {name:'Font Style', key:'T', icon:'<i class="icon-font"></i>Font style', className:'font-style', dropMenu :[
                {name:'Normal text', openWith:'<p>', closeWith:'</p>' },
                  {name:'Title 1', openWith:'<h1>', closeWith:'</h1>' },
                  {name:'Title 2', openWith:'<h2>', closeWith:'</h2>' },
                  {name:'Title 3', openWith:'<h3>', closeWith:'</h3>' }
        ]},
        {btngrp:'start'},
		{name:'Bold', key:'B', icon:'<i class="icon-bold"></i>', openWith:'(!(<strong>|!|<b>)!)', closeWith:'(!(</strong>|!|</b>)!)' },
		{name:'Italic', key:'I', icon:'<i class="icon-italic"></i>', openWith:'(!(<em>|!|<i>)!)', closeWith:'(!(</em>|!|</i>)!)'  },
		{name:'Stroke through', key:'S', icon:'<i class="icon-ban-circle"></i>',  openWith:'<del>', closeWith:'</del>' },
        {btngrp:'stop'},
		{separator:'---------------' },
        {btngrp:'start'},
		{name:'Bulleted List', icon:'<i class="icon-list"></i>', openWith:'    <li>', closeWith:'</li>', multiline:true, openBlockWith:'<ul>\n', closeBlockWith:'\n</ul>'},
		{name:'Numeric List', icon:'<i class="icon-th-list"></i>', openWith:'    <li>', closeWith:'</li>', multiline:true, openBlockWith:'<ol>\n', closeBlockWith:'\n</ol>'},
        {btngrp:'stop'},
        {separator:'---------------' },
        {btngrp:'start'},
		{name:'Picture', key:'P', icon:'<i class="icon-picture"></i>', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
		{name:'Link', key:'L', icon:'<i class="icon-globe"></i>', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
        {btngrp:'stop'},
        {separator:'---------------' },
		{name:'Preview', icon:'<i class="icon-eye-open"></i>', className:'preview',  call:'preview'},
        {separator:'---------------' },
        {informations:'Shift + Enter : Insert newline'},
        {name:'HTML Mode', className:'editor-mode-name'}
	]
}
