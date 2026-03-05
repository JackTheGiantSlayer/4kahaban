import React from 'react';
import { Typography, Divider, Tabs, List, Grid } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Terms = () => {
    const thaiContent = (
        <div>
            <Title level={4}>แบบสอบถามสำหรับผู้สนใจรับอุปการะ</Title>
            <Paragraph>
                ทางสี่ขาหาบ้านอยากขอความร่วมมือให้ท่านที่สนใจรับอุปการะสุนัขอ่านแบบสอบถามให้ละเอียดถี่ถ้วน พร้อมตอบแบบสอบถามทุกข้อโดยละเอียดเพื่อประโยชน์ของท่าน ทั้งนี้ขอให้ท่านช่วยตอบแบบสอบถามดังต่อไปนี้เข้าสู่ <b><a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">กล่องข้อความ (Inbox) ของเพจ</a></b> (<a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">https://www.facebook.com/4kahaban?locale=th_TH</a>):
            </Paragraph>

            <List
                size="small"
                bordered
                dataSource={[
                    '1. ชื่อ-นามสกุล :',
                    '2. ที่อยู่ตามทะเบียนบ้าน :',
                    '3. ที่อยู่ในการนำสัตว์เลี้ยงไปดูแล :',
                    '4. เบอร์โทรศัพท์ติดต่อ :',
                    '5. อาชีพ :',
                    '6. จำนวนผู้พักอาศัยภายในบ้าน :',
                    '7. มีผู้พักอาศัยอยู่ภายในบ้านตลอด 24 ชั่วโมงหรือไม่? ถ้ามีกรุณาระบุว่าคือใคร :',
                    '8. ปรึกษาภายในครอบครัวแล้วหรือไม่? :',
                    '9. มีความรับผิดชอบในการนำสิ่งมีชีวิตมาเป็นสัตว์เลี้ยงหรือไม่? :',
                    '10. ถ้ามีสัตว์เลี้ยงอยู่ ขอทราบชนิดของสัตว์เลี้ยง, จำนวน สายพันธุ์, เพศ, อายุ :',
                    '11. ถ้าเคยมีสัตว์เลี้ยง ขอทราบชนิดของสัตว์เลี้ยง, จำนวน, สายพันธุ์, เพศ, อายุ และสาเหตุที่สัตว์เลี้ยงเสียชีวิต :',
                    '12. มีสัตวแพทย์คลินิคประจำเพื่อดูแลสัตว์เลี้ยงหรือไม่? ถ้ามีกรุณาระบุชื่อคลินิค :',
                    '13. รูปถ่ายรอบบริเวณบ้าน โดยถ่ายจากด้านนอกรั้วบ้านให้เห็นทั้ง 4 ด้าน และถ่ายจากในบ้านให้เห็นรั้วและบริเวณบ้านทั้ง 4 ด้าน เพื่อดูว่ามีพื้นที่เพียงพอสำหรับสัตว์เลี้ยงหรือไม่? :'
                ]}
                renderItem={(item) => <List.Item><Text strong>{item}</Text></List.Item>}
                style={{ marginBottom: '20px' }}
            />

            <Paragraph>
                สนใจรับเพื่อนที่ซื่อสัตย์ไปเลี้ยง ท่านสามารถติดต่อโดยแจ้งชื่อและเบอร์ติดต่อใน <b><a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">กล่องข้อความ (inbox)</a></b> (<a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">https://www.facebook.com/4kahaban?locale=th_TH</a>) ได้คะ ถ้าท่านไม่สะดวกในการรับเลี้ยงแต่อยากช่วยเหลือ ขอเชิญแชร์, แทคภาพ, หรือเชิญชวนเพื่อนๆที่ท่านรู้จักมากด "ไลก์" ที่เพจสี่ขาหาบ้านได้เลยนะคะ
            </Paragraph>

            <Paragraph>
                ถ้าท่านได้อ่านแบบสอบถามโดยละเอียดและปรึกษาสมาชิกภายในครอบครัวของท่านแล้ว ท่านจะรู้ตัวเองได้อย่างชัดเจนว่าท่านมีความพร้อมที่จะรับผิดชอบชีวิตสุนัขที่จะเข้าเป็นสมาชิกใหม่ของครอบครัวหรือไม่ แบบสอบถามของเพจเป็นเพียงแค่ข้อเตือนใจและแบบทดสอบให้แก่ตัวท่านเอง หากท่านพร้อมที่จะดูแลสุนัขที่ถูกทอดทิ้งด้วยการให้โอกาสแก่สุนัขที่จะมีชีวิตใหม่ที่อบอุ่น เพจมีความยินดีและพร้อมที่จะมอบสุนัขให้แก่ท่านเช่นกัน
            </Paragraph>

            <div style={{ background: '#fffbe6', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #faad14', marginBottom: '24px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>พิจารณาเฉพาะเขตกรุงเทพมหานครและปริมณฑลใกล้เคียง</li>
                    <li>สำหรับผู้ที่ยังไม่บรรลุนิติภาวะ นักเรียน นักศึกษากรุณาให้ผู้ปกครองเป็นผู้ติดต่อ</li>
                    <li><b>ไม่พิจารณา</b> บ้านเช่า หอพัก บ้านพักข้าราชการ และคอนโด</li>
                </ul>
            </div>

            <Title level={4}>รายละเอียดเพิ่มเติมที่ต้องระบุเพื่อประกอบการพิจารณา</Title>
            <Divider style={{ margin: '12px 0' }} />
            <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
                <li>รบกวนระบุว่าเป็นท่านใด กลางวัน สุนัขจะอยู่ที่ไหน กลางคืนนอนที่ไหน ตั้งใจจะเลี้ยงสุนัขแบบไหน ให้อยู่อย่างไร เช่น ในบ้าน นอกบ้าน หรือบริเวณใด</li>
                <li>เวลาเปิดปิดประตูบ้านนำรถเข้าออกสุนัขจะอยู่ทีไหน</li>
                <li>ปกติให้สุนัขขับถ่ายที่ไหน หากสุนัขร้อนขุดสวนรื้อต้นไม้จะมีวิธีดูแลแก้ไขยังไง</li>
                <li>สมาชิกในครอบครัว ใครจะเป็นหลักในการดูแลน้อง เช่นการให้อาหาร อาบน้ำ พาไปพบแพทย์ หรือหากเดินทางไม่มีคนอยู่บ้านแพลนยังไง</li>
                <li>คลีนิค รพ สัตว์ที่คาดว่าจะใช้บริการ สะดวกให้สุนัขขึ้นรถหรือแพลนพาไปหาหมออย่างไร</li>
                <li>ความรู้ประสบการณ์ในการดูแลเลี้ยงสุนัข ก่อนหน้านี้ ฉีดวัคซีนอะไรบ้าง มีสัตว์เลี้ยงอื่น?</li>
                <li>เหตผลที่ต้องการรับอุปการะ ความเข้าใจนิสัยสายพันธุ์ที่คุณเข้าใจ โรคที่ต้องระวัง</li>
                <li>ทัศนคติเรื่องการทำหมัน พร้อมจะทำเมื่อโตขึ้นหรือไม่ / สุนัข หรือแมวเดิม ได้รับการทำหมัน หรือป้องกันผสมอย่างไร</li>
                <li>อาหารที่ใช้เลี้ยงอาหารเม็ด / คลุก การดูแลเห็บหมัดวิธีใด</li>
                <li>พร้อมรับมือความซน พร้อมสอนและไม่ส่งต่อให้ญาติหรือคนอืน</li>
                <li>มีแพลนไปเรียนต่อหรือไปอยู่ต่างประเทศในอนาคตหรือไม่</li>
                <li>กทม ปริมณฑลใกล้เคียง ที่พร้อมตามเงื่อนไขค่ะ</li>
                <li><b>มีการทำสัญญาการรับอุปการะ</b> (<a href="/Contract documents-2569.pdf" download>ดาวน์โหลดตัวอย่างสัญญาที่นี่</a>)</li>
            </ul>
        </div>
    );

    const englishContent = (
        <div>
            <Title level={4}>Adoption Questionnaire & Conditions</Title>
            <Paragraph>
                The "4kahaban" (Four-Legged Seeking Home) page kindly requests your cooperation. If you are interested in adopting a dog, please read and answer the following questionnaire carefully and thoroughly for your benefit. Once completed, please send your answers to our <b><a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">Facebook Inbox</a></b> (<a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">https://www.facebook.com/4kahaban?locale=th_TH</a>):
            </Paragraph>

            <List
                size="small"
                bordered
                dataSource={[
                    '1. First Name - Last Name:',
                    '2. Registered House Address:',
                    '3. Actual Address where the pet will be living:',
                    '4. Contact Phone Number:',
                    '5. Occupation:',
                    '6. Number of people living in the house:',
                    '7. Is there someone at home 24 hours a day? If yes, please specify who:',
                    '8. Have you consulted and received approval from all family members?',
                    '9. Are you fully responsible for bringing a living creature into your home as a pet?',
                    '10. If you currently have pets, please specify species, quantity, breed, gender, and age:',
                    '11. If you previously had pets, please specify species, quantity, breed, gender, age, and the cause of passing:',
                    '12. Do you have a regular veterinary clinic to care for the pet? If so, state the clinic\'s name:',
                    '13. Photographs around your house area: Please take photos from outside the fence showing all 4 sides, and from inside showing the fence and courtyard on all 4 sides to determine if there is enough space for a pet.'
                ]}
                renderItem={(item) => <List.Item><Text strong>{item}</Text></List.Item>}
                style={{ marginBottom: '20px' }}
            />

            <Paragraph>
                If you are interested in giving a loyal friend a forever home, please contact us by sending your name and phone number to our <b><a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">Facebook Inbox</a></b> (<a href="https://www.facebook.com/4kahaban?locale=th_TH" target="_blank" rel="noopener noreferrer">https://www.facebook.com/4kahaban?locale=th_TH</a>). If you are not ready to adopt but still wish to help, please feel free to share our posts, tag friends, or invite people to "Like" the 4kahaban page!
            </Paragraph>

            <Paragraph>
                If you have read the questionnaire thoroughly and consulted your family members, you will know clearly whether you are ready to take responsibility for a dog's life as a new family member. This questionnaire serves as a reminder and a self-test. If you are ready to care for an abandoned dog and give them a chance at a warm new life, we are more than happy and ready to entrust a dog to you.
            </Paragraph>

            <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #1890ff', marginBottom: '24px' }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Consideration is specifically limited to the <b>Bangkok Metropolitan Region and nearby areas</b>.</li>
                    <li>For minors, students, and undergraduates, please have a parent or guardian act as the primary contact.</li>
                    <li><b>We do not consider</b> rental houses, dormitories, government housing/barracks, and condominiums/apartments.</li>
                </ul>
            </div>

            <Title level={4}>Additional Required Details for Consideration</Title>
            <Divider style={{ margin: '12px 0' }} />
            <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
                <li>Please clarify who you are. Where will the dog be during the day? Where will they sleep at night? Tell us how you intend to raise the dog (e.g., indoor, outdoor, specific zones).</li>
                <li>When opening/closing gates for vehicles, where will the dog be kept to ensure safety?</li>
                <li>Where will the dog typically relieve themselves? If the dog digs up the garden out of thermal stress or boredom, how will you handle/correct it?</li>
                <li>Which family member will be the primary caretaker (feeding, bathing, vet visits)? If everyone travels and no one is home, what is your plan for the dog?</li>
                <li>Which animal hospital/clinic do you plan to use? Are you able to transport the dog in a vehicle for vet visits?</li>
                <li>What is your knowledge and experience with raising dogs? What vaccines have your previous dogs received? Any other current pets?</li>
                <li>What is your reason for wanting to adopt? Explain your understanding of this breed's temperament and diseases to watch out for.</li>
                <li>What is your attitude towards sterilization (spaying/neutering)? Are you ready to do it when they come of age? How are your current dogs/cats sterilized or prevented from breeding?</li>
                <li>What food will you provide (kibble / mixed meals)? How will you manage tick/flea prevention?</li>
                <li>Are you ready to handle mischievous behavior, ready to teach them, and promise <b>not</b> to pass them on to relatives or anyone else?</li>
                <li>Do you have any plans to study or move abroad in the future?</li>
                <li>Must reside in Bangkok/vicinity and be ready to comply with the living conditions.</li>
                <li><b>An adoption contract must be signed.</b> (<a href="/Contract documents-2569.pdf" download>Download sample contract here</a>)</li>
            </ul>
        </div>
    );

    const items = [
        {
            key: '1',
            label: 'ภาษาไทย (TH)',
            children: thaiContent,
        },
        {
            key: '2',
            label: 'English (EN)',
            children: englishContent,
        },
    ];

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    return (
        <div style={{
            padding: isMobile ? '16px' : '24px',
            maxWidth: '900px',
            margin: '0 auto',
            background: '#fff',
            borderRadius: '8px',
            marginTop: isMobile ? '0' : '24px',
            boxShadow: isMobile ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
        }}>
            <Title level={isMobile ? 4 : 3} style={{ textAlign: 'center', color: '#1677ff', marginBottom: '24px' }}>Terms & Conditions / Adoption Questionnaire</Title>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default Terms;
