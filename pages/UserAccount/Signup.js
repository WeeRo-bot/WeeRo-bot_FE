import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import api from '../../axios';

export default function SignupScreen({ navigation }) {
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  // 회원가입 필드
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [concern, setConcern] = useState('');

  // 나이 드롭다운
  const [ageOpen, setAgeOpen] = useState(false);
  const [ageValue, setAgeValue] = useState(null);
  const [ageItems, setAgeItems] = useState([
    { label: '10대', value: 10 },
    { label: '20대', value: 20 },
    { label: '30대', value: 30 },
    { label: '40대 이상', value: 40 },
  ]);

  // 성별 드롭다운
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: '남성', value: 'MALE' },
    { label: '여성', value: 'FEMALE' },
  ]);

  // 모달
  const [visibleModal, setVisibleModal] = useState(null);

  // 아이디 중복 메시지
  const [idMessage, setIdMessage] = useState('아이디는 문자와 숫자만 가능합니다.');

  const handleCheckId = async () => {
    if (!id) {
      setIdMessage('아이디를 입력해주세요.');
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(id)) {
      setIdMessage('아이디는 문자와 숫자만 가능합니다.');
      return;
    }
try {
  const res = await api.post('/api/member/checkId', { id });
  if (res.data.data.available) {
    setIdMessage('사용 가능한 아이디입니다.');
  } else {
    setIdMessage('이미 사용 중인 아이디입니다.');
  }
} catch (err) {
  console.error(err);
  setIdMessage('중복 확인 중 오류가 발생했습니다.');
}
  };

  const handleSignup = async () => {
    if (!id || !password || !nickname) {
      Alert.alert('필수 입력', 'ID, 비밀번호, 닉네임을 입력해주세요.');
      return;
    }
    if (password !== passwordCheck) {
      Alert.alert('비밀번호 불일치', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agree1 || !agree2) {
      Alert.alert('필수 동의', '모든 필수 항목에 동의해주세요.');
      return;
    }

try {
  const response = await api.post('/api/member/signup', {
    id: id,
    password: password,
    passwordConfirm: passwordCheck,
    name: nickname,
    age: ageValue ?? 0,
    gender: genderValue || null,
    occupation: occupation || null,
    concern: concern || null,
  });

  if (response.status === 200) {
    Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.', [
      { text: '확인', onPress: () => navigation.navigate('Login') }
    ]);
  }
} catch (error) {
  if (error.response && error.response.data) {
    Alert.alert('회원가입 실패', error.response.data); // 서버에서 내려준 메시지 그대로
  } else {
    Alert.alert('회원가입 실패', '네트워크 오류가 발생했습니다.');
  }
}
  };


  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.inner}>
        
        {/* 아이디 입력 */}
        <Text style={styles.label}>ID *</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="아이디"
            value={id}
            onChangeText={setId}
          />
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckId}>
            <Text style={styles.checkButtonText}>중복 확인</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>{idMessage}</Text>

        {/* 비밀번호 */}
        <Text style={styles.label}>비밀번호 *</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.subText}>비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상입니다.</Text>

        {/* 비밀번호 확인 */}
        <Text style={styles.label}>비밀번호 확인 *</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
          value={passwordCheck}
          onChangeText={setPasswordCheck}
        />

        {/* 닉네임 */}
        <Text style={styles.label}>닉네임 *</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          value={nickname}
          onChangeText={setNickname}
        />

        {/* 나이 & 성별 */}
        <View style={styles.row}>
          <View style={{ flex: 1, zIndex: genderOpen ? 0 : 1 }}>
            <Text style={styles.label}>나이</Text>
            <DropDownPicker
              open={ageOpen}
              value={ageValue}
              items={ageItems}
              setOpen={setAgeOpen}
              setValue={setAgeValue}
              setItems={setAgeItems}
              placeholder="선택"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={{ flex: 1, zIndex: ageOpen ? 0 : 1 }}>
            <Text style={styles.label}>성별</Text>
            <DropDownPicker
              open={genderOpen}
              value={genderValue}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={setGenderValue}
              setItems={setGenderItems}
              placeholder="선택"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>

        {/* 직업 */}
        <Text style={styles.label}>직업</Text>
        <TextInput
          style={styles.input}
          placeholder="직업"
          value={occupation}
          onChangeText={setOccupation}
        />

        {/* 고민 */}
        <Text style={styles.label}>고민</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="고민 내용 입력"
          multiline
          value={concern}
          onChangeText={setConcern}
        />

        {/* 체크박스 */}
        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={agree1 ? 'checked' : 'unchecked'}
            onPress={() => setAgree1(!agree1)}
            color="#78C1F3"
            uncheckedColor="#ccc"
          />
          <Text style={styles.checkboxLabel}>
            [필수] 개인정보 수집 및 이용 동의{' '}
            <TouchableOpacity onPress={() => setVisibleModal('privacy')}>
              <Text style={styles.link}>상세보기</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={agree2 ? 'checked' : 'unchecked'}
            onPress={() => setAgree2(!agree2)}
            color="#78C1F3"
            uncheckedColor="#ccc"
          />
          <Text style={styles.checkboxLabel}>
            [필수] AI 분석 및 저장 데이터 활용 동의{' '}
            <TouchableOpacity onPress={() => setVisibleModal('ai')}>
              <Text style={styles.link}>상세보기</Text>
            </TouchableOpacity>
          </Text>
        </View>

        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>회원가입</Text>
        </TouchableOpacity>

        <Text style={styles.notice}>*표시는 필수 입력 사항입니다.</Text>
      </ScrollView>

      {/* 모달 */}
      <Modal
        visible={visibleModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setVisibleModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {visibleModal === 'privacy'
                ? '개인정보 수집 및 이용 동의'
                : 'AI 분석 및 데이터 활용 동의'}
            </Text>
            <Text style={styles.modalText}>
              {visibleModal === 'privacy'
            ? '[필수] 개인정보 수집 및 이용 동의본 서비스는 회원가입 및 원활한 서비스 제공을 위해 아래와 같은 개인정보를 수집·이용합니다.\n• 필수 수집 항목: ID, 비밀번호, 닉네임\n• 선택 수집 항목: 나이, 성별, 직업, 고민 등 추가 정보 (입력 시 맞춤형 서비스 제공)\n• 이용 목적: 회원 식별 및 서비스 제공, 맞춤형 감정 분석 서비스 운영\n• 보유 기간: 회원 탈퇴 시 즉시 삭제 (단, 관련 법령에 따라 일정 기간 보관될 수 있음)\n\n※ 필수 항목 제공에 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.'
            : '[필수] AI 분석 및 감정 데이터 활용 동의본 서비스는 AI 기반 감정 분석 기능을 제공하며, 사용자의 감정 데이터를 분석하여 맞춤형 콘텐츠를 추천합니다.\n• AI 분석 목적: 감정 패턴 분석, 감정 조절 솔루션 제공\n• 활용 방식: 감정 데이터는 익명 처리되어 연구 및 서비스 개선에 활용될 수 있음\n\n※ 필수 항목 제공에 동의하지 않을 경우 감정 분석 및 맞춤형 콘텐츠 제공이 제한될 수 있습니다.'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setVisibleModal(null)}
            >
              <Text style={styles.modalCloseButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 20, marginBottom: 7 },
  input: {
    borderWidth: 1, borderColor: '#78C1F3', borderRadius: 20,
    paddingHorizontal: 15, paddingVertical: 10,
  },
  subText: { fontSize: 12, marginTop: 5, color: '#78C1F3', marginBottom: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  checkButton: {
    backgroundColor: '#78C1F3', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 20, marginLeft: 10,
  },
  checkButtonText: { color: '#fff', fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  checkboxLabel: { flex: 1 },
  link: { textDecorationLine: 'underline', color: '#78C1F3' },
  signupButton: {
    marginTop: 15, backgroundColor: '#B4D4FF', borderRadius: 20,
    paddingVertical: 12, alignItems: 'center',
  },
  signupButtonText: { color: '#fff', fontWeight: 'bold' },
  notice: { fontSize: 12, color: '#f00', marginTop: 10, textAlign: 'center' },
  dropdown: { borderColor: '#78C1F3', borderRadius: 20, paddingHorizontal: 15 },
  dropdownContainer: { borderColor: '#78C1F3', borderRadius: 20 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '80%', maxHeight: '70%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 14, lineHeight: 20 },
  modalCloseButton: {
    marginTop: 20, backgroundColor: '#78C1F3',
    paddingVertical: 10, borderRadius: 15, alignItems: 'center',
  },
  modalCloseButtonText: { color: '#fff', fontWeight: 'bold' },
});
