document.addEventListener('DOMContentLoaded', function() {
  const saveBtn = document.getElementById('saveBtn');
  const tagInput = document.getElementById('tagInput');
  const tagList = document.getElementById('tagList');

  renderTags();

  saveBtn.addEventListener('click', async () => {
    const tagName = tagInput.value.trim();
    if (!tagName) {
      alert('请输入标签名！');
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const newTag = {
      name: tagName,
      url: tab.url,
      title: tab.title
    };

    chrome.storage.local.get({ tags: [] }, (result) => {
      const tags = result.tags;
      tags.push(newTag);
      chrome.storage.local.set({ tags: tags }, () => {
        tagInput.value = '';
        renderTags();
      });
    });
  });

  function renderTags() {
    chrome.storage.local.get({ tags: [] }, (result) => {
      tagList.innerHTML = '';
      [...result.tags].reverse().forEach((tag) => {
        const div = document.createElement('div');
        div.className = 'tag-item';
        div.innerHTML = `
          <a href="${tag.url}" target="_blank">${tag.title}</a>
          <span class="tag-name"># ${tag.name}</span>
        `;
        tagList.appendChild(div);
      });
    });
  }
});
