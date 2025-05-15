// filepath: /C:/Users/takei/OneDrive/デスクトップ/toryokun/static/scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const aiChatWindow = document.getElementById('aiChatWindow');
    const aiHelpButton = document.getElementById('aiHelpButton');
    const closeChatWindow = document.getElementById('closeChatWindow');
    const sendMessage = document.getElementById('sendMessage');

    if (aiChatWindow) {
        aiChatWindow.style.display = 'none';
    }

    if (aiHelpButton) {
        aiHelpButton.addEventListener('click', function() {
            aiChatWindow.style.display = 'flex';
            setTimeout(() => aiChatWindow.classList.add('show'), 10);
        });
    }

    if (closeChatWindow) {
        closeChatWindow.addEventListener('click', function() {
            aiChatWindow.classList.remove('show');
            setTimeout(() => aiChatWindow.style.display = 'none', 300);
        });
    }

    if (sendMessage) {
        sendMessage.addEventListener('click', function() {
            const userMessage = document.getElementById('aiInput').value;
            if (userMessage.trim() !== "") {
                const chatContent = document.querySelector('.chat-content');
                const userMessageElement = document.createElement('p');
                userMessageElement.textContent = userMessage;
                chatContent.appendChild(userMessageElement);
                document.getElementById('aiInput').value = '';

                // サーバーに質問を送信
                fetch('/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ question: userMessage })
                })
                .then(response => response.json())
                .then(data => {
                    const aiResponseElement = document.createElement('p');
                    aiResponseElement.textContent = data.answer;
                    chatContent.appendChild(aiResponseElement);
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }

    // 各レベルの評価表データ
    const evaluations = {
        "01": [
          { category: "基本遂行力", item: "指示を理解し、正確に仕事を遂行・完成させる基本的な能力が備わっているか。" },
          { category: "仕事の応用力", item: "指示の意図を把握し、基本業務にうまく応用できているか。" },
          { category: "読解力", item: "図面や資料を常に確認し、内容を正確に理解できているか。" },
          { category: "創意工夫", item: "与えられた業務に対して、成果達成のための工夫が行われているか。" },
          { category: "拡大深化", item: "自己技能の向上・拡大のため、積極的に知識や手順書などを吸収しているか。" },
          { category: "作業段取り力", item: "効率的な作業段取りを立て、業務をスムーズに進められているか。" },
          { category: "機材・資材管理力", item: "使用した備品、道具、機器および共通資材を適切に管理できているか。" },
          { category: "安全意識", item: "現場および車両など、すべての安全面に十分な注意を払い、事故防止に努めているか。" },
          { category: "規律遵守", item: "会社の定める書類提出や指示を守り、基本的なルールに従っているか。" },
          { category: "伝達・報告力", item: "関係部署や上司への情報伝達・報告が正確かつ迅速に行われているか。" },
          { category: "自己主張", item: "会議等で適切に意見を述べ、自己の意思を明確に示せているか。" },
          { category: "勤務態度", item: "熱意をもって真面目に業務に取り組んでいるか。" },
          { category: "責任感", item: "職務遂行にあたり、常に責任を果たす努力が見られるか。" },
          { category: "協調性", item: "上司・同僚と円滑に協力しながら業務を遂行しているか。" },
          { category: "挑戦意欲", item: "困難な業務や問題に対し、積極的に取り組み、克服しようとする意欲があるか。" },
          { category: "礼儀・身だしなみ", item: "顧客・近隣・上司に対する礼儀と、常に整った身だしなみが保たれているか。" },
          { category: "自己啓発・貢献", item: "自身の長所・短所を認識し、他者からの助言を受け入れて改善し、周囲に良い影響を与えているか。" },
          { category: "体調管理", item: "自己の体調を適切に管理し、健康状態を維持しているか。" },
          { category: "清掃意識", item: "清掃、整理、整頓を意識し、職場環境が整備されているか。" },
          { category: "傾聴力", item: "上司や同僚の意見をしっかり傾聴し、そこから学ぶ姿勢があるか。" }
        ],
        "02": [
          { category: "仕事の知識", item: "仕事に活用できる専門知識を十分に有しているか。" },
          { category: "読解力", item: "図面や資料を常に確認し、業務に的確に活かせているか。" },
          { category: "創意工夫", item: "成果達成のための工夫や改善アイデアを実践できているか。" },
          { category: "作業効率", item: "無駄を省き、効率的に仕事を進める工夫ができているか。" },
          { category: "採算意識", item: "採算意識を持ち、収益向上を目指す行動が取れているか。" },
          { category: "仕事の出来", item: "指示された仕事を正確に、完成度高く仕上げられているか。" },
          { category: "拡大深化", item: "自己技能の向上のために、積極的に新たな知識を吸収し、実務に反映しているか。" },
          { category: "仕事の段取り", item: "業務に対する段取りを的確に行い、効率的な作業進行が実現されているか。" },
          { category: "機器・材料管理", item: "備品、道具、機器および共通の材料を丁寧に扱い、適切に管理できているか。" },
          { category: "安全意識", item: "現場および共有車両・重機の安全対策を十分に実践しているか。" },
          { category: "規律・清掃意識", item: "会社規律の遵守と、清掃・整理・整頓が徹底されているか。" },
          { category: "伝達・報告力", item: "関係部署への伝達や上司への業務報告が正確かつ迅速に行われているか。" },
          { category: "ＩＳＯ理解", item: "ＩＳＯの考え方を理解し、業務に取り入れているか。" },
          { category: "自己主張", item: "会議などで適切に意見を述べ、自己の意思を明確に表現できているか。" },
          { category: "勤務態度", item: "高い熱意と真面目な姿勢で業務に取り組んでいるか。" },
          { category: "責任感・リーダーシップ", item: "職務に対して責任を果たすとともに、次期リーダーとしての自覚があるか。" },
          { category: "協調性", item: "上司・同僚と円滑に協力し、チームとして成果を上げられているか。" },
          { category: "教育", item: "新人（1～2年目）の教育・指導が適切に行われ、後進の育成に寄与しているか。" },
          { category: "礼儀・身だしなみ", item: "顧客、近隣、上司に対する礼儀が守られ、常に整った身だしなみが保たれているか。" },
          { category: "自己啓発・貢献", item: "自己の長所・短所を認識し、他者の助言を積極的に取り入れながら自己改善し、周囲に良い影響を与えているか。" }
        ],
        "03": [
          { category: "専門知識・図面理解", item: "仕事に必要な専門知識と、設計図書の意図を的確に理解・把握し、現場に応用できているか。" },
          { category: "採算意識", item: "採算意識を持ち、収益向上に向けた取り組みが行われているか。" },
          { category: "拡大深化（自己研鑽）", item: "日常や勤務外で、自己の知識・技能の向上に努めているか。" },
          { category: "機器・資材管理", item: "備品、道具、機器・共有車両・重機および共通材料を適切に管理し、活用できているか。" },
          { category: "リーダーシップ", item: "作業主任としての統率力を発揮し、現場を効果的にリードできているか。" },
          { category: "判断力", item: "状況を的確に判断し、適切な意思決定ができているか。" },
          { category: "人材育成", item: "部下の長所・短所を把握し、能力向上に向けた指導が実践されているか。" },
          { category: "工程管理", item: "業務の段取りが的確に行われ、工期短縮や生産性向上に寄与しているか。" },
          { category: "安全管理", item: "事故災害防止のための対策が総括的に実施され、安全管理が徹底されているか。" },
          { category: "コミュニケーション・報告力", item: "各班間の連絡が密に行われ、報告・連絡・相談が適切かつ速やかに行われているか。" },
          { category: "規律", item: "会社で定められた規律やルールがしっかり守られているか。" },
          { category: "ＩＳＯ理解・教育", item: "ＩＳＯの考え方を深く理解し、部下への教育に活かされているか。" },
          { category: "戦略的展望・計画力", item: "部門の将来に対する独自の見解と、現場全体の計画や戦略を立案できているか。" },
          { category: "発想力", item: "新たな企画、工法など革新的なアイデアを発表・実践できているか。" },
          { category: "自己主張", item: "会議等で適切に意見を述べ、自己の考えを明確に示せているか。" },
          { category: "積極・問題発見力", item: "困難な業務や潜在的な問題に対して積極的に取り組み、的確に問題を見出し解決策を提案できているか。" },
          { category: "責任感", item: "与えられた仕事に最後まで責任を持って取り組む姿勢があるか。" },
          { category: "協調性", item: "上司・同僚と良好に協力し、チームとして円滑な業務遂行ができているか。" },
          { category: "プロフェッショナル人格", item: "社会人としてのエチケット・マナーを備え、信頼される人格が形成されているか。" },
          { category: "清掃意識", item: "清掃、整理、整頓を徹底し、常に良好な作業環境が維持されているか。" }
        ],
        "04": [
          { category: "仕事の遂行", item: "自分の職責を十分に果たし、組織に貢献する業務遂行力が発揮されているか。" },
          { category: "知識", item: "立場に即した高度な専門知識を備え、実務に的確に活用できているか。" },
          { category: "収益・経費管理", item: "採算意識を持ち、収益向上および経費節減を戦略的に実現できているか。" },
          { category: "拡大深化", item: "日常および勤務外で、自己の知識・技能のさらなる向上に努めているか。" },
          { category: "統率・判断力", item: "立場にふさわしい統率力と、状況に応じた適正な判断力を有しているか。" },
          { category: "人材管理", item: "社員の能力や行動を的確に把握し、適切な評価と管理を行い、組織全体の成長に寄与しているか。" },
          { category: "環境整備・清掃意識", item: "社員が働きやすい環境を整備し、清掃・整理・整頓が徹底されているか。" },
          { category: "相談・助言", item: "メンバーに対して適切に相談に応じ、励ましや助言を行い、チームの士気向上に貢献しているか。" },
          { category: "部下の教育", item: "部下に対する教育・育成が十分に行われ、次世代のリーダーを育成する体制が整っているか。" },
          { category: "施工配慮", item: "施工にあたり、各班で無理・無駄・むらが生じないよう、全体を調整・配慮できているか。" },
          { category: "工程管理", item: "工程表に基づき、現場を段取りよく管理し、工期短縮や生産性向上に努めているか。" },
          { category: "安全管理", item: "事故災害発生防止のため、先進的かつ総括的な安全対策が実施されているか。" },
          { category: "指示", item: "指示が的確かつ一貫性をもって伝えられ、組織全体に浸透しているか。" },
          { category: "ＩＳＯ理解・教育", item: "ＩＳＯの考え方を深く理解し、部下への教育に効果的に活かされているか。" },
          { category: "戦略的問題意識", item: "会社の将来について独自の見解を持ち、現場の問題を的確に把握・解決する戦略的な意識があるか。" },
          { category: "自己主張", item: "重要な場面で明確かつ影響力のある発言ができるか。" },
          { category: "協調性", item: "上司、同僚、部下と良好な連携を保ち、組織全体の業務を円滑に推進できているか。" },
          { category: "自己成長意識", item: "部門長としての自覚をもち、継続的な自己研鑽と自己改善に努め、部門全体の向上に寄与しているか。" },
          { category: "意欲", item: "惰性に陥ることなく、常に前向きに新たな挑戦に取り組む強い意欲があるか。" },
          { category: "営業活動", item: "営業的活動を通じ、組織の成長や市場拡大に具体的に貢献しているか。" }
        ]
      };
      
      // ページごとの評価表データを取得
      const h2Element = document.querySelector('h2');
      if (h2Element) {
        const levelMatch = h2Element.textContent.match(/工務(\d+)/);
        if (levelMatch) {
          const level = levelMatch[1];
          const evaluationsData = evaluations[level];
      
          // 評価項目の入力領域を生成
          const compContainer = document.getElementById("compContainer");
          evaluationsData.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "item-row";
            const label = document.createElement("div");
            label.className = "item-label";
            label.textContent = `${index + 1}. ${item.category} - ${item.item}`;
            row.appendChild(label);
            
            const inputGroup = document.createElement("div");
            inputGroup.className = "input-group";
            
            const ratingDiv = document.createElement("div");
            const ratingLabel = document.createElement("label");
            ratingLabel.textContent = "評価:";
            ratingDiv.appendChild(ratingLabel);
            const ratingInput = document.createElement("input");
            ratingInput.type = "range";
            ratingInput.id = "rate" + index;
            ratingInput.className = "rating-input";
            ratingInput.min = "1";
            ratingInput.max = "5";
            ratingInput.step = "1";
            ratingInput.value = "3";
            ratingDiv.appendChild(ratingInput);
            const ratingValue = document.createElement("span");
            ratingValue.id = "ratingValue" + index;
            ratingValue.className = "rating-value";
            ratingValue.textContent = " 3";
            ratingDiv.appendChild(ratingValue);
            inputGroup.appendChild(ratingDiv);
            
            const weightDiv = document.createElement("div");
            const weightLabel = document.createElement("label");
            weightLabel.textContent = "重み:";
            weightDiv.appendChild(weightLabel);
            const weightInput = document.createElement("input");
            weightInput.type = "number";
            weightInput.id = "weight" + index;
            weightInput.className = "weight-input";
            weightInput.min = "0.1";
            weightInput.step = "0.1";
            weightInput.value = "1";
            weightDiv.appendChild(weightInput);
            inputGroup.appendChild(weightDiv);
            
            const pointDiv = document.createElement("div");
            const pointLabel = document.createElement("label");
            pointLabel.textContent = "ポイント:";
            pointDiv.appendChild(pointLabel);
            const pointSpan = document.createElement("span");
            pointSpan.id = "point" + index;
            pointSpan.className = "point-display";
            pointSpan.textContent = "0.00";
            pointDiv.appendChild(pointSpan);
            inputGroup.appendChild(pointDiv);
            
            row.appendChild(inputGroup);
            compContainer.appendChild(row);
            
            ratingInput.addEventListener("input", function() {
              document.getElementById("ratingValue" + index).textContent = " " + ratingInput.value;
            });
          });
      
          document.getElementById('analyzeBtn').addEventListener('click', function() {
            let totalScore = 0;
            let totalWeight = 0;
            evaluationsData.forEach((item, index) => {
              const rating = Number(document.getElementById("rate" + index).value);
              const weight = Number(document.getElementById("weight" + index).value);
              const point = rating * weight;
              totalScore += point;
              totalWeight += weight;
              document.getElementById("point" + index).textContent = point.toFixed(2);
            });
            let weightMessage = "";
            if (Math.abs(totalWeight - 20) > 0.001) {
              weightMessage = `<p style="color:red;">※注意：全項目の重みの合計が ${totalWeight.toFixed(1)} になっています。全体で20になるように調整してください。</p>`;
            }
            const resultText = `
              <h3>評価結果</h3>
              <p>全項目の重みの合計： ${totalWeight.toFixed(1)}</p>
              ${weightMessage}
              <p>総合スコア（各項目の評価×重みの合計）： ${totalScore.toFixed(2)}</p>
            `;
            document.getElementById('resultArea').innerHTML = resultText;
          });
        }
      }
      
      // OKR解析用の設定
      if (document.getElementById("objective")) {
        const kr1Slider = document.getElementById("kr1");
        const kr2Slider = document.getElementById("kr2");
        const kr3Slider = document.getElementById("kr3");
        const kr1Value = document.getElementById("kr1Value");
        const kr2Value = document.getElementById("kr2Value");
        const kr3Value = document.getElementById("kr3Value");
      
        kr1Slider.addEventListener("input", function() {
          kr1Value.textContent = kr1Slider.value + "%";
        });
        kr2Slider.addEventListener("input", function() {
          kr2Value.textContent = kr2Slider.value + "%";
        });
        kr3Slider.addEventListener("input", function() {
          kr3Value.textContent = kr3Slider.value + "%";
        });
      
        document.getElementById("analyzeBtn").addEventListener("click", function() {
          const objective = document.getElementById("objective").value;
          const kr1 = Number(kr1Slider.value);
          const kr2 = Number(kr2Slider.value);
          const kr3 = Number(kr3Slider.value);
          
          const averageKR = (kr1 + kr2 + kr3) / 3;
          
          // シンプルな解析例：平均進捗に応じた提案を行う
          let okrAdvice = "";
          if (averageKR < 50) {
            okrAdvice = "Key Results の進捗が低調です。具体的なタスクの見直しや、実行計画の再検討を推奨します。";
          } else if (averageKR < 80) {
            okrAdvice = "Key Results の進捗はまずまずですが、さらなる改善が可能です。具体的なアクションプランの強化を検討してください。";
          } else {
            okrAdvice = "Key Results の進捗は順調です。この調子で現状維持、またはさらなる挑戦を検討してください。";
          }
          
          const resultHtml = `
            <h3>解析結果</h3>
            <p><strong>Objective:</strong> ${objective}</p>
            <p><strong>Key Result 1:</strong> ${kr1}%</p>
            <p><strong>Key Result 2:</strong> ${kr2}%</p>
            <p><strong>Key Result 3:</strong> ${kr3}%</p>
            <p><strong>平均進捗:</strong> ${averageKR.toFixed(1)}%</p>
            <hr>
            <p>${okrAdvice}</p>
          `;
          
          document.getElementById("resultArea").innerHTML = resultHtml;
        });
      }
      
      // 管理者ページ用の設定保存機能
      if (document.getElementById("adminTableContainer")) {
        const levelSelect = document.getElementById("levelSelect");
        const adminTableContainer = document.getElementById("adminTableContainer");
      
        function renderAdminTable(level) {
          const data = evaluations[level];
          let html = '<table class="table-auto">';
          html += '<tr><th>通し番号</th><th>分類</th><th>評価項目</th><th>初期重み</th></tr>';
          data.forEach((item, index) => {
            const weight = item.weight !== undefined ? item.weight : 1; // デフォルト値を設定
            html += `<tr>
                      <td style="width: 1px;">${index + 1}</td>
                      <td style="width: 150px;"><input type="text" value="${item.category}" data-index="${index}" data-field="category"></td>
                      <td class="w-1/2" style="word-break: break-word; white-space: normal; min-width: 300px;"><input type="text" value="${item.item}" data-index="${index}" data-field="item"></td>
                      <td ><input type="number" class="w-20 text-center" value="${weight}" min="0.1" step="0.1" data-index="${index}" data-field="weight"></td>
                     </tr>`;
          });
          html += '</table>';
          adminTableContainer.innerHTML = html;
        }
      
        renderAdminTable(levelSelect.value);
      
        levelSelect.addEventListener("change", function() {
          renderAdminTable(this.value);
        });
      
        const saveBtn = document.getElementById("saveBtn");
        if (saveBtn) {
          saveBtn.addEventListener("click", function() {
            const inputs = adminTableContainer.querySelectorAll("input");
            inputs.forEach(input => {
              const index = input.getAttribute("data-index");
              const field = input.getAttribute("data-field");
              evaluations[levelSelect.value][index][field] = (field === "weight") ? Number(input.value) : input.value;
            });
            alert("設定を保存しました。\n\n" + JSON.stringify(evaluations[levelSelect.value], null, 2));
            console.log("保存後のデータ:", evaluations[levelSelect.value]);
          });
        }
      }
      
      // OKR設定用のグローバル変数
      const okrSettings = {
        objectives: [
          {
            objective: "現場作業の効率向上",
            keyResults: [
              "作業時間を10％短縮",
              "安全管理のチェックリスト遵守率を95％に",
              "クレーム件数を半減"
            ]
          }
        ]
      };
      
      // 初期表示でフォームに既存の設定を反映
      function renderObjectives() {
        const container = document.getElementById("objectivesContainer");
        if (!container) return; // containerが存在しない場合は何もしない
      
        container.innerHTML = ""; // 既存の内容をクリア
      
        okrSettings.objectives.forEach((okr, objIndex) => {
          const objDiv = document.createElement("div");
          objDiv.className = "objective-container";
      
          const objLabel = document.createElement("label");
          objLabel.textContent = `Objective ${objIndex + 1}:`;
          objDiv.appendChild(objLabel);
      
          const objInput = document.createElement("input");
          objInput.type = "text";
          objInput.className = "objective-input block w-full p-3 border border-gray-300 rounded text-lg";
          objInput.value = okr.objective;
          objInput.setAttribute("data-obj-index", objIndex);
          objDiv.appendChild(objInput);
      
          const krContainer = document.createElement("div");
          krContainer.className = "key-results-container";
      
          okr.keyResults.forEach((kr, krIndex) => {
            const krDiv = document.createElement("div");
            krDiv.className = "key-result-item";
      
            const krLabel = document.createElement("label");
            krLabel.textContent = `Key Result ${krIndex + 1}:`;
            krDiv.appendChild(krLabel);
      
            const krInput = document.createElement("input");
            krInput.type = "text";
            krInput.className = "key-result-input block w-full p-2 border border-gray-300 rounded text-md";
            krInput.value = kr;
            krInput.setAttribute("data-obj-index", objIndex);
            krInput.setAttribute("data-kr-index", krIndex);
            krDiv.appendChild(krInput);
      
            krContainer.appendChild(krDiv);
          });
      
          objDiv.appendChild(krContainer);
          container.appendChild(objDiv);
        });
      }
      
      // objectivesContainerが存在する場合にのみrenderObjectivesを呼び出す
      if (document.getElementById("objectivesContainer")) {
        renderObjectives();
      }
      
      // 「Objectiveを追加」ボタンの処理
      const addObjectiveBtn = document.getElementById("addObjectiveBtn");
      if (addObjectiveBtn) {
        addObjectiveBtn.addEventListener("click", function() {
          okrSettings.objectives.push({
            objective: "",
            keyResults: ["", "", ""]
          });
          renderObjectives();
        });
      }
      
      // 「設定を保存」ボタンの処理
      const saveOkrBtn = document.getElementById("saveOkrBtn");
      if (saveOkrBtn) {
        saveOkrBtn.addEventListener("click", function() {
          const objInputs = document.querySelectorAll(".objective-input");
          objInputs.forEach(input => {
            const objIndex = input.getAttribute("data-obj-index");
            okrSettings.objectives[objIndex].objective = input.value.trim();
          });
      
          const krInputs = document.querySelectorAll(".key-result-input");
          krInputs.forEach(input => {
            const objIndex = input.getAttribute("data-obj-index");
            const krIndex = input.getAttribute("data-kr-index");
            okrSettings.objectives[objIndex].keyResults[krIndex] = input.value.trim();
          });
      
          alert("OKR設定を保存しました。\n\n" + JSON.stringify(okrSettings, null, 2));
          console.log("保存後のOKR設定:", okrSettings);
        });
      }
      
      document.addEventListener('DOMContentLoaded', function() {
        const objectivesContainer = document.getElementById('objectivesContainer');
        const addObjectiveBtn = document.getElementById('addObjectiveBtn');
        const saveOkrBtn = document.getElementById('saveOkrBtn');
      
        let objectiveCount = 0;
      
        addObjectiveBtn.addEventListener('click', function() {
            objectiveCount++;
            const objectiveDiv = document.createElement('div');
            objectiveDiv.classList.add('objective');
            objectiveDiv.innerHTML = `
                <h3>Objective ${objectiveCount}</h3>
                <input type="text" placeholder="Objectiveを入力">
                <div class="key-results">
                    <h4>Key Result 1</h4>
                    <input type="text" placeholder="Key Resultを入力">
                    <h4>Key Result 2</h4>
                    <input type="text" placeholder="Key Resultを入力">
                    <h4>Key Result 3</h4>
                    <input type="text" placeholder="Key Resultを入力">
                </div>
            `;
            objectivesContainer.appendChild(objectiveDiv);
        });
      
        saveOkrBtn.addEventListener('click', function() {
            const objectives = [];
            document.querySelectorAll('.objective').forEach(objectiveDiv => {
                const objectiveText = objectiveDiv.querySelector('input[type="text"]').value;
                const keyResults = [];
                objectiveDiv.querySelectorAll('.key-results input[type="text"]').forEach(keyResultInput => {
                    keyResults.push(keyResultInput.value);
                });
                objectives.push({ objective: objectiveText, keyResults: keyResults });
            });
      
            console.log('OKR設定を保存:', objectives);
            // ここでサーバーにデータを送信する処理を追加できます
        });
    });
      
      document.addEventListener('DOMContentLoaded', function() {
        const searchBox = document.getElementById('searchBox');
        const termsContainer = document.getElementById('termsContainer');
      
        // JSONファイルを読み込んで用語を表示する関数
        fetch('terms.json')
          .then(response => response.json())
          .then(data => {
            displayTerms(data);
            searchBox.addEventListener('input', function() {
              const query = katakanaToHiragana(this.value.trim().toLowerCase());
              const words = query.split(/\s+/);
              const filteredTerms = data.filter(term => {
                const termText = katakanaToHiragana(term.term.toLowerCase() + ' ' + term.description.toLowerCase());
                return words.some(word => termText.includes(word));
              });
              displayTerms(filteredTerms);
            });
          });
      
        // 用語を表示する関数
        function displayTerms(terms) {
          termsContainer.innerHTML = '';
          terms.forEach(term => {
            const termDiv = document.createElement('div');
            termDiv.className = 'term';
            termDiv.innerHTML = `<h3>${term.term}</h3><p>${term.description}</p>`;
            termsContainer.appendChild(termDiv);
          });
        }
      
        // KatakanaをHiraganaに変換する簡易関数
        function katakanaToHiragana(str) {
          return str.replace(/[\u30A1-\u30F6]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
          });
        }
      
        // 音声認識の設定（Web Speech API利用）
        const micButton = document.getElementById('micButton');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          console.log('このブラウザはWeb Speech APIに対応していません。');
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
      
        micButton.addEventListener('click', function() {
          recognition.start();
        });
      
        recognition.addEventListener('result', function(event) {
          const transcript = event.results[0][0].transcript;
          console.log('認識結果:', transcript);
          searchBox.value = transcript;
          searchBox.dispatchEvent(new Event('input'));
        });
      
        recognition.addEventListener('error', function(event) {
          console.error('音声認識エラー:', event.error);
        });
      });
});
